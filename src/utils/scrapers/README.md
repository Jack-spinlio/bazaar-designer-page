# Exhibitor Information Scraper

This directory contains tools for scraping exhibitor information from websites like Taipei Cycle.

## Prerequisites

Before running the scraper, you'll need to install the required Python dependencies:

```bash
pip install requests beautifulsoup4
```

## Using the Python Scraper Directly

You can run the Python scraper directly using:

```bash
python3 exhibitor_scraper.py --help
```

### Command-line options:

- `--start NUM`: Starting page number (default: 1)
- `--end NUM`: Ending page number (default: 3)
- `--sleep NUM`: Sleep time between requests in seconds (default: 1)
- `--output FILENAME`: Output filename without extension (default: "exhibitors")
- `--format FORMAT`: Output format: json, csv, or both (default: json)
- `--url URL`: Scrape a single URL instead of multiple pages
- `--site SITE`: Specify the website to scrape (currently only 'taipeicycle' is supported)

### Examples:

Scrape pages 1-3 from Taipei Cycle website and output to JSON:
```bash
python3 exhibitor_scraper.py --start 1 --end 3 --output exhibitors-data
```

Scrape a single exhibitor URL:
```bash
python3 exhibitor_scraper.py --url "https://www.taipeicycle.com.tw/en/exhibitor/FE080C4C566775294993566389172FC1D0636733C6861689/info.html"
```

## Using the JavaScript Wrapper

For convenience, we also provide a JavaScript wrapper that can be run using Node.js:

```bash
node scripts/scrape-exhibitors.js --help
```

This script accepts similar options to the Python script and can also import the data directly into Supabase with the `--import` flag.

### Examples:

Scrape exhibitors and import to Supabase:
```bash
node scripts/scrape-exhibitors.js --start 1 --end 5 --import
```

Scrape a specific Taipei Cycle exhibitor:
```bash
node scripts/scrape-exhibitors.js --url "https://www.taipeicycle.com.tw/en/exhibitor/65ED6FE214D269DFF8C4337C271FDFC6/info.html"
```

## Using in the Application

The scraper is integrated into the application through the TypeScript service in `src/integrations/scrapers/exhibitorScraper.ts`.

You can use this service in your components to fetch and update exhibitor data:

```typescript
import { ExhibitorScraperService } from '@/integrations/scrapers/exhibitorScraper';

// Example: Fetch a single exhibitor
const scraperService = new ExhibitorScraperService('taipeicycle');
const exhibitorData = await scraperService.fetchExhibitorByUrl('https://www.taipeicycle.com.tw/en/exhibitor/65ED6FE214D269DFF8C4337C271FDFC6/info.html');

// Example: Import data to Supabase
await scraperService.importToSupabase([exhibitorData]);
```

## Modifying the Scraper

### Taipei Cycle Website

The current implementation is tailored for the Taipei Cycle website. The key selectors used are:

- Exhibitor Name: `div.company_info h2` or from meta tags
- Booth Info: From location elements within the company_info section
- Thumbnail URL: `div.company_info .img-container img`
- Products: From the `h3` section labeled "Products" or meta description
- Description: From the `h3` section labeled "Description"
- Gallery Images: From various image sliders in the product section

If the structure of the website changes, you may need to update these selectors in the `scrape_exhibitor_info` function.

## Database Schema

The scraper is designed to work with the following Supabase tables:

- `exhibitors`: Stores the main exhibitor information
- `exhibitor_gallery`: Stores gallery images for each exhibitor

See the SQL migration file at `supabase/migrations/20240326-create-exhibitor-tables.sql` for the full schema. 