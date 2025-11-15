import { NextRequest, NextResponse } from 'next/server';

// Israeli Government Data API
const CKAN_API_BASE = 'https://data.gov.il/api/3/action/datastore_search';
const VEHICLE_RESOURCE_ID = '053cea08-09bc-40ec-8f7a-156f0677aff3';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const licensePlate = searchParams.get('plate');

  if (!licensePlate) {
    return NextResponse.json(
      { error: 'License plate is required' },
      { status: 400 }
    );
  }

  // Validate Israeli license plate format (7-8 digits)
  const cleanPlate = licensePlate.replace(/\s+/g, '');
  if (!/^\d{7,8}$/.test(cleanPlate)) {
    return NextResponse.json(
      { error: 'מספר רישוי לא תקין. יש להזין 7-8 ספרות' },
      { status: 400 }
    );
  }

  try {
    // Query the Israeli government vehicle database
    const url = new URL(CKAN_API_BASE);
    url.searchParams.append('resource_id', VEHICLE_RESOURCE_ID);
    url.searchParams.append('q', cleanPlate);
    url.searchParams.append('limit', '5');

    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new Error('Failed to fetch from government API');
    }

    const data = await response.json();

    // Return the raw data for the client to process
    return NextResponse.json({
      success: data.success,
      records: data.result?.records || [],
      total: data.result?.total || 0,
    });

  } catch (error: any) {
    console.error('Vehicle lookup API error:', error);
    return NextResponse.json(
      { error: 'שגיאה בחיפוש ברישום הרכבים', details: error.message },
      { status: 500 }
    );
  }
}
