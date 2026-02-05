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

## Project goal

This project was primarily a **practice playground** to go deeper into a few specific frontend topics:

- Working with a **data-heavy UI** (DataGrid) and keeping a **single source of truth** for filters and derived views.
- Coordinating **table + chart** so that both respond instantly to the same filter state.
- Exploring **responsive layout patterns** with MUI (sidebar vs. drawer, spacing, typography) without relying on a design system from Figma.
- Playing with **UX details** such as loading skeletons, empty states, and small touches like recent searches that make the experience feel more polished.

The code is intentionally structured in a way that makes it easy to extend or refactor (e.g., swapping the API layer, adding new filters, or introducing server-side pagination) so it can serve as a reference for similar dashboards in the future.
