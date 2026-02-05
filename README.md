# Flight Search Engine

A responsive web app for searching flights, with live price trends and filters that update results and the price chart in real time.

## Features

- **Search & results** – Origin, destination, and date inputs with a clear list of flight results
- **Live price graph** – Chart (Recharts) showing price distribution; updates in real time as you change filters
- **Complex filtering** – Stops, price range, and airline filters applied together; both the flight list and the price graph update instantly
- **Responsive layout** – Usable on desktop and mobile (filters in a sidebar on desktop, in a drawer on mobile)
- Loading skeletons and empty states

## Tech stack

React 18, Vite, TypeScript, Material UI, MUI DataGrid, Recharts.

## Getting started

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Project structure

```
src/
├── api/           # Data fetching and API client
├── components/    # UI components
├── hooks/         # useFlights (state and filtering)
├── types/
├── App.tsx
├── main.tsx
└── theme.ts
```
