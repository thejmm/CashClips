## Pricing Plans

| **Plan**    | **Monthly Price ($)** | **Yearly Price ($)** | **Clips/Month** | **FPS** | **Length (s)** | **Features**                                                                                             |
| ----------- | --------------------- | -------------------- | --------------- | ------- | -------------- | --------------------------------------------------------------------------------------------------------- |
| **Starter** | 12.99                 | 140.29               | 15              | 30      | 30             | - 30fps export quality<br>- 30s video length<br>- Auto-captioning                                      |
| **Clipper** | 29.99                 | 329.88               | 30              | 30      | 60             | - 30fps export quality<br>- 60s video length<br>- Auto-captioning                                      |
| **Streamer**| 69.99                 | 755.89               | 60              | 30      | 60             | - 30fps export quality<br>- 60s video length<br>- Auto-captioning                                      |
| **Ultimate**| 159.99                | 1,727.89             | 100             | 60      | 60             | - 60fps export quality<br>- 60s video length<br>- Auto-captioning                                      |
| **Agency**  | 319.98                | 3,455.78             | 200             | 60      | 60             | - 60fps export quality<br>- 60s video length<br>- Auto-captioning                                      |

## Profit Margins

### Monthly Profit Margin (%)

$\text{Profit Margin} = \left( \frac{\text{Monthly Profit}}{\text{Monthly Price}} \right) \times 100\%$

| **Plan**    | **Monthly Profit ($)** | **Monthly Price ($)** | **Profit Margin (%)** |
| ----------- | ---------------------- | --------------------- | --------------------- |
| **Starter** | 11.50                  | 12.99                 | 88.53%                |
| **Clipper** | 24.02                  | 29.99                 | 80.09%                |
| **Streamer**| 58.05                  | 69.99                 | 82.93%                |
| **Ultimate**| 120.18                 | 159.99                | 75.12%                |
| **Agency**  | 240.35                 | 319.98                | 75.09%                |

### Yearly Profit Margin (%)

$\text{Profit Margin} = \left( \frac{\text{Yearly Profit}}{\text{Yearly Price}} \right) \times 100\%$

| **Plan**    | **Yearly Profit ($)** | **Yearly Price ($)** | **Profit Margin (%)** |
| ----------- | --------------------- | -------------------- | --------------------- |
| **Starter** | 122.37                | 140.29               | 87.22%                |
| **Clipper** | 258.22                | 329.88               | 78.28%                |
| **Streamer**| 612.56                | 755.89               | 81.04%                |
| **Ultimate**| 1,250.13              | 1,727.89             | 72.36%                |
| **Agency**  | 2,500.27              | 3,455.78             | 72.35%                |

---

## Credit Calculation

- **Formula**:
  $\text{Credits per Clip} = \frac{\text{Width} \times \text{Height} \times \text{FPS} \times \text{Length (s)}}{100,000,000}$

- **Parameters**:
  - **Resolution**: 1280 x 720 (720p)
  - **Cost per Credit**: $0.012 (Based on purchasing 10,000 credits for $120 monthly)

---

## Cost Calculation

- **Cost per Credit**:
  $\text{Cost per Credit} = \frac{\$120}{10,000 \text{ credits}} = \$0.012$

- **Monthly Cost**:
  $\text{Monthly Cost} = \text{Monthly Credits} \times \$0.012$

- **Yearly Cost**:
  $\text{Yearly Cost} = \text{Yearly Credits} \times \$0.012$

---

## Profit Calculation

- **Monthly Profit**:
  $\text{Monthly Profit} = \text{Monthly Price} - \text{Monthly Cost}$

- **Yearly Profit**:
  $\text{Yearly Profit} = \text{Yearly Price} - \text{Yearly Cost}$

---

```mermaid
```mermaid
graph LR
    A[Pricing Plans]

    A --> B[Starter]
    A --> C[Clipper]
    A --> D[Streamer]
    A --> E[Ultimate]
    A --> F[Agency]

    B --> |Monthly| BM["$12.99"]
    B --> |Yearly| BY["$140.29"]
    C --> |Monthly| CM["$29.99"]
    C --> |Yearly| CY["$329.88"]
    D --> |Monthly| DM["$69.99"]
    D --> |Yearly| DY["$755.89"]
    E --> |Monthly| EM["$159.99"]
    E --> |Yearly| EY["$1,727.89"]
    F --> |Monthly| FM["$319.98"]
    F --> |Yearly| FY["$3,455.78"]

    BM --> BMP["Profit: $11.50 (88.53%)"]
    BY --> BYP["Profit: $122.37 (87.22%)"]
    CM --> CMP["Profit: $24.02 (80.09%)"]
    CY --> CYP["Profit: $258.22 (78.28%)"]
    DM --> DMP["Profit: $58.05 (82.93%)"]
    DY --> DYP["Profit: $612.56 (81.04%)"]
    EM --> EMP["Profit: $120.18 (75.12%)"]
    EY --> EYP["Profit: $1,250.13 (72.36%)"]
    FM --> FMP["Profit: $240.35 (75.09%)"]
    FY --> FYP["Profit: $2,500.27 (72.35%)"]

    classDef default fill:#f0f0f0,stroke:#333,stroke-width:1px;
    classDef plan fill:#e1f5fe,stroke:#01579b,stroke-width:2px,font-weight:bold;
    classDef price fill:#fff9c4,stroke:#fbc02d,stroke-width:2px;
    classDef profit fill:#c8e6c9,stroke:#2e7d32,stroke-width:2px,font-weight:bold;
    
    class A default;
    class B,C,D,E,F plan;
    class BM,BY,CM,CY,DM,DY,EM,EY,FM,FY price;
    class BMP,BYP,CMP,CYP,DMP,DYP,EMP,EYP,FMP,FYP profit;

    linkStyle default stroke:#666,stroke-width:1px;
```
```
