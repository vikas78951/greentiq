<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know



## 1. Architecture

Use a feature-oriented architecture.

``` text
root/
├── app/
│   ├── api/
│   │   ├── customers/
│   │   └── saved-filters/
│   ├── dashboard/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── layout.tsx
│   └── providers.tsx
│
├── components/
│   ├── ui/
│   └── shared/
│
├── features/
│   ├── customers/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── schemas/
│   │   ├── services/
│   │   ├── types/
│   │   └── utils/
│   │
│   └── saved-filters/
│       ├── components/
│       ├── hooks/
│       ├── services/
│       └── types/
│
├── lib/
│   ├── query-client.ts
│   ├── api-client.ts
│   ├── utils.ts
│   ├── data.ts
│   └── constants.ts
│
├── types/
│    └── types.ts

```




This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->
