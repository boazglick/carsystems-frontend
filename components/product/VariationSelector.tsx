'use client';

import { useState, useEffect } from 'react';
import { formatPrice } from '@/lib/utils';

interface Variation {
  id: number;
  price: string;
  regular_price: string;
  sale_price: string;
  on_sale: boolean;
  attributes: {
    id: number;
    name: string;
    option: string;
  }[];
  stock_status: string;
  image?: {
    src: string;
  };
}

interface Attribute {
  id: number;
  name: string;
  slug: string;
  position: number;
  visible: boolean;
  variation: boolean;
  options: string[];
}

interface VariationSelectorProps {
  productId: number;
  attributes: Attribute[];
  variations: Variation[];
  onVariationSelect: (variation: Variation | null) => void;
  initialPrice: string;
}

export function VariationSelector({
  productId,
  attributes,
  variations,
  onVariationSelect,
  initialPrice,
}: VariationSelectorProps) {
  // Only show variation attributes
  const variationAttributes = attributes.filter(attr => attr.variation);

  // State for selected options
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [selectedVariation, setSelectedVariation] = useState<Variation | null>(null);

  // Find matching variation when options change
  useEffect(() => {
    if (Object.keys(selectedOptions).length === 0) {
      setSelectedVariation(null);
      onVariationSelect(null);
      return;
    }

    // Check if all variation attributes have been selected
    const allSelected = variationAttributes.every(attr =>
      selectedOptions[attr.name] || selectedOptions[attr.slug]
    );

    if (!allSelected) {
      setSelectedVariation(null);
      onVariationSelect(null);
      return;
    }

    // Find matching variation
    const matchingVariation = variations.find(variation => {
      return variation.attributes.every(varAttr => {
        const selectedValue = selectedOptions[varAttr.name] || selectedOptions[varAttr.name.toLowerCase()];
        // Empty option means "any" in WooCommerce
        if (!varAttr.option) return true;
        return varAttr.option === selectedValue;
      });
    });

    setSelectedVariation(matchingVariation || null);
    onVariationSelect(matchingVariation || null);
  }, [selectedOptions, variations, variationAttributes, onVariationSelect]);

  const handleOptionChange = (attributeName: string, value: string) => {
    setSelectedOptions(prev => ({
      ...prev,
      [attributeName]: value,
    }));
  };

  if (variationAttributes.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {variationAttributes.map(attribute => (
        <div key={attribute.id || attribute.slug} className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            {attribute.name}
          </label>
          <div className="flex flex-wrap gap-2">
            {attribute.options.map(option => {
              const isSelected = selectedOptions[attribute.name] === option;

              // Check if this option is available (has a variation in stock)
              const isAvailable = variations.some(variation => {
                const matchesOption = variation.attributes.some(
                  attr => attr.name === attribute.name && (attr.option === option || !attr.option)
                );
                return matchesOption && variation.stock_status === 'instock';
              });

              return (
                <button
                  key={option}
                  onClick={() => handleOptionChange(attribute.name, option)}
                  disabled={!isAvailable}
                  className={`
                    px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all
                    ${isSelected
                      ? 'border-navy bg-navy text-white'
                      : isAvailable
                        ? 'border-gray-300 bg-white text-gray-700 hover:border-navy'
                        : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed line-through'
                    }
                  `}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {/* Show selected variation price */}
      {selectedVariation && (
        <div className="pt-2 text-sm text-green font-medium">
          נבחר: {selectedVariation.attributes.map(a => a.option).join(' / ')}
        </div>
      )}

      {/* Warning if no selection */}
      {variationAttributes.length > 0 && !selectedVariation && Object.keys(selectedOptions).length > 0 && (
        <div className="pt-2 text-sm text-red font-medium">
          אנא בחר את כל האפשרויות
        </div>
      )}
    </div>
  );
}
