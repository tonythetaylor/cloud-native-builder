# Cloud Native Builder

Cloud Native Builder is a full‑stack web application that empowers developers, security engineers, and enterprises to visually design, deploy, and manage secure, compliant, cloud‑native infrastructures.

## Features

- **Visual Designer**  
  Drag‑and‑drop compute, network, storage, and security components onto a canvas.

- **DevSecOps Automation**  
  Auto‑generate Terraform/Helm IaC, GitHub Actions/Jenkins pipelines, and compliance artifacts (NIST, FedRAMP, PCI‑DSS).

- **Security Integrations**  
  Built‑in WAF, IDS, SIEM, static analysis, and AI‑powered anomaly detection.

- **Multi‑Cloud Support**  
  Preview and export configurations for AWS, Azure, and GCP.

---

## Key Features

- **Project Management**  
  Create, save, and load architecture blueprints.

- **Role‑Based Access**  
  JWT‑backed authentication for teams and audit trails.

- **One‑Click Export**  
  Download Terraform code or push to your Git repo with a single button.

- **Extensible Modules**  
  Plug in new compliance packs, security tools, or custom services.

---

## Getting Started

1. **Clone the repository**  
   ```bash
   git clone https://github.com/your-org/cloud-native-builder.git
   cd cloud-native-builder
   ```

2. **Frontend**  
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **Backend**  
   ```bash
   cd ../backend
   pip install -r requirements.txt
   uvicorn app.main:app --reload
   ```

4. **Open the App**  
   Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

---

## License

Distributed under the MIT License. See `LICENSE` for more information.
