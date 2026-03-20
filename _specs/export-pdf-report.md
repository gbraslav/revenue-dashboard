# Spec for Export PDF Report

branch: claude/feature/export-pdf-report

## Summary
Connect the "Export PDF" button on the dashboard so that clicking it generates and downloads a PDF report server-side. The report includes the 4 dashboard charts and the full activities list at the bottom. The navigation menu bar is not shown in the report.

## Functional Requirements
- Clicking the "Export PDF" button triggers a request to a server-side API endpoint
- The API endpoint generates a PDF containing:
  - All 4 dashboard graphs/charts
  - The activities list below the charts
  - No navigation menu bar
- The generated PDF is returned as a file download to the browser
- The PDF layout is clean and print-friendly
- All chart and activity data used in the PDF is fetched server-side (not relying on client state)

## Possible Edge Cases
- API data fetch failure during PDF generation should return a meaningful error response
- Large activities lists should paginate or scroll correctly within the PDF
- Charts must render correctly in a headless server environment (no browser canvas)

## Acceptance Criteria
- Clicking "Export PDF" downloads a PDF file
- PDF contains all 4 charts rendered visibly
- PDF contains the full activities list below the charts
- Navigation menu bar does not appear in the PDF
- PDF is generated entirely on the server (no client-side rendering)
- Download starts without navigating away from the dashboard

## Open Questions
- Should the PDF include a title/header with a date or report name? yes
- Should the activities list in the PDF be limited to a certain number of entries or include all? all of them 
- What paper size/orientation should be used (A4, Letter, landscape)? Letter orientation

# Testing Guidelines
Create a test file(s) in the ./test folder for the new feature, and create meaningful tests for the following cases, without going too heavy:
- API endpoint returns a valid PDF content-type response
- API endpoint returns an error response when upstream data fetches fail
- The PDF generation includes chart data and activities data
- The Export PDF button triggers the correct API call
