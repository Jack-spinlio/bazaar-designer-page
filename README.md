# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/101013a1-6ec8-469f-ac56-624fb180d240

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/101013a1-6ec8-469f-ac56-624fb180d240) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with .

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Supabase for database and authentication
- Python for web scraping

## Exhibitor Scraping Feature

This project includes a web scraper for collecting exhibitor information from websites like Taipei Cycle. The scraper can be used to automatically populate the marketplace with component manufacturers.

### Taipei Cycle Integration

The scraper is specifically tailored to extract exhibitor information from the Taipei Cycle website (https://www.taipeicycle.com.tw). It can extract:

- Company names and booth information
- Product listings and descriptions
- Gallery images
- Brand names and other details

### Setup

1. **Prepare Database Tables**

You need to set up the database tables in Supabase first. To do this:

- Go to your Supabase dashboard
- Open the SQL Editor
- Create a new query
- Paste and run the following SQL:

```sql
-- Create exhibitors table
CREATE TABLE IF NOT EXISTS exhibitors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  booth_info TEXT,
  address TEXT,
  telephone TEXT,
  fax TEXT,
  website TEXT,
  email TEXT,
  products TEXT,
  description TEXT,
  thumbnail_url TEXT,
  source_url TEXT,
  claimed BOOLEAN DEFAULT FALSE,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create index on slug for faster lookups
CREATE INDEX IF NOT EXISTS exhibitors_slug_idx ON exhibitors (slug);

-- Create index on name for faster text searches
CREATE INDEX IF NOT EXISTS exhibitors_name_idx ON exhibitors (name);

-- Create exhibitor gallery images table
CREATE TABLE IF NOT EXISTS exhibitor_gallery (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  exhibitor_id UUID NOT NULL REFERENCES exhibitors(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create index on exhibitor_id for faster lookups
CREATE INDEX IF NOT EXISTS exhibitor_gallery_exhibitor_id_idx ON exhibitor_gallery (exhibitor_id);
```

2. **Install Dependencies**

The scraper requires Python 3 and the following dependencies:
```sh
# Install Python dependencies
pip install -r requirements.txt

# Install Node.js dependencies
npm install
```

### Usage

You can run the scraper in several ways:

#### Using the UI (Recommended)

1. Start both the Express server and the Vite frontend:
```sh
npm run dev:all
```

2. Navigate to the Exhibitors page in your browser
3. Click the "Scrape Data" button in the UI
4. Wait for the scraping process to complete
5. The exhibitors data will be automatically loaded and displayed

#### Using command-line

```sh
# Scrape exhibitors without importing to database
npm run scrape

# Scrape and import to Supabase database
npm run scrape:import

# Run the scraper from UI via command line (requires server to be running)
npm run scrape:ui
```

For more options, see the script help:
```sh
npm run scrape -- --help
```

### Architecture

The scraping system has three main components:

1. **Python scraper** (`scripts/exhibitor_scraper.py`): Performs the actual web scraping
2. **Express.js server** (`server/index.js`): Provides an API endpoint to trigger the scraper
3. **React UI** (`src/pages/Exhibitors.tsx`): Provides a user interface to trigger and view scraped data

### Customizing the Scraper

- The Python scraper code is in `scripts/exhibitor_scraper.py`
- The Express.js server is in `server/index.js`
- The React UI components are in `src/pages/Exhibitors.tsx` and `src/pages/ExhibitorProfile.tsx`
- The TypeScript integration is in `src/integrations/scrapers/exhibitorScraper.ts`
- Database schema is defined in `supabase/migrations/20240326-create-exhibitor-tables.sql`

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/101013a1-6ec8-469f-ac56-624fb180d240) and click on Share -> Publish.

## I want to use a custom domain - is that possible?

We don't support custom domains (yet). If you want to deploy your project under your own domain then we recommend using Netlify. Visit our docs for more details: [Custom domains](https://docs.lovable.dev/tips-tricks/custom-domain/)
