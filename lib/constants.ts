export const APP_NAME = "Greentiq"



// table pagination and filter 
export const TABLE_CONFIG = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 10,
  ALLOWED_PAGE_SIZES: [10, 25, 50] as const,
} as const