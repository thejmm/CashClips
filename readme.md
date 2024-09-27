## Pricing and Profit Breakdown

| Plan     | Monthly Price ($) | Yearly Price ($) | Clips/Month | FPS | Length (s) | Credits/Clip | Monthly Credits | Yearly Credits | Monthly Cost ($) | Yearly Cost ($) | Monthly Profit ($) | Yearly Profit ($) |
| -------- | ----------------- | ---------------- | ----------- | --- | ---------- | ------------ | --------------- | -------------- | ---------------- | --------------- | ------------------ | ----------------- |
| Starter  | 12.99             | 140.29           | 15          | 30  | 30         | 8.2944       | 124.416         | 1,492.992      | 1.24             | 14.93           | 11.75              | 125.36            |
| Clipper  | 29.99             | 329.88           | 30          | 30  | 60         | 16.5888      | 497.664         | 5,971.968      | 4.98             | 59.72           | 25.01              | 270.16            |
| Streamer | 69.99             | 755.89           | 60          | 30  | 60         | 16.5888      | 995.328         | 11,943.936     | 9.95             | 119.44          | 60.04              | 636.45            |
| Ultimate | 159.99            | 1,727.89         | 100         | 60  | 60         | 33.1776      | 3,317.76        | 39,813.12      | 33.18            | 398.13          | 126.81             | 1,329.76          |
| Agency   | 319.98            | 3,455.78         | 200         | 60  | 60         | 33.1776      | 6,635.52        | 79,626.24      | 66.36            | 796.26          | 253.62             | 2,659.52          |

## Explanatory Text

1. **Credit Calculation**:

   - Credits per clip = (1280 _ 720 _ FPS \* Length) / 100,000,000
   - Monthly credits = Credits per clip \* Clips per month
   - Yearly credits = Monthly credits \* 12

2. **Cost Calculation**:

   - Cost is based on the rate of 10,000 credits for $100
   - Monthly cost = (Monthly credits / 10,000) \* $100
   - Yearly cost = (Yearly credits / 10,000) \* $100

3. **Profit Calculation**:

   - Monthly profit = Monthly price - Monthly cost
   - Yearly profit = Yearly price - Yearly cost

4. **Key Observations**:
   - All plans are profitable, with higher tier plans generating more absolute profit.
   - The Starter plan has the highest profit margin (~90%), while the Agency plan has the lowest (~79%).
   - Yearly subscriptions offer slightly better profit margins due to the 10% discount.
   - The jump from 30fps to 60fps in Ultimate and Agency plans significantly increases credit usage.

```mermaid
graph TD
    A[Plans] --> B[Starter]
    A --> C[Clipper]
    A --> D[Streamer]
    A --> E[Ultimate]
    A --> F[Agency]

    B --> BM[Monthly]
    B --> BY[Yearly]
    C --> CM[Monthly]
    C --> CY[Yearly]
    D --> DM[Monthly]
    D --> DY[Yearly]
    E --> EM[Monthly]
    E --> EY[Yearly]
    F --> FM[Monthly]
    F --> FY[Yearly]

    BM --> BMP["$11.75"]
    BY --> BYP["$125.36"]
    CM --> CMP["$25.01"]
    CY --> CYP["$270.16"]
    DM --> DMP["$60.04"]
    DY --> DYP["$636.45"]
    EM --> EMP["$126.81"]
    EY --> EYP["$1,329.76"]
    FM --> FMP["$253.62"]
    FY --> FYP["$2,659.52"]

    classDef default fill:#ffffff,stroke:#000000,stroke-width:2px;
    classDef profit fill:#ffffff,stroke:#000000,stroke-width:2px,font-weight:bold;
    class A,B,C,D,E,F,BM,BY,CM,CY,DM,DY,EM,EY,FM,FY default;
    class BMP,BYP,CMP,CYP,DMP,DYP,EMP,EYP,FMP,FYP profit;

    linkStyle default stroke:#000000,stroke-width:1px;
````
