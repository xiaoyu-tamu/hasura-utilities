#Usage

Create a `hasura.config.js` in the project root. By default, it will generate all tables and views under public schema

```
// hasura.config.js

module.exports = {
  tables: [],
  views: []
};
```

1. `yarn` or `npm install`
2. `yarn dev` or `npm run dev`

---

Camelcase table/column name for selected table and views, useful when you add new table/view and don't want to regenerate other tables.

```
// hasura.config.js
module.exports = {
  tables: ["public.purchase_order_transaction", "public.purchase_order_transaction_detail"],
  views: ["public.sales_order_product_statistic", "public.sales_order_listing_statistic"]
};

```

You can modify `index.ts` if you need more customization.
