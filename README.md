https://jiopaychatbot.vercel.app/

```markdown
# JioPay AI Chatbot - Full Stack RAG System

*Next.js + FastAPI Retrieval-Augmented Generation Chatbot*

## 🌟 Features
- **AI-Powered Q&A** using LLaMA-3-8B via Groq
- **Document Retrieval** from JioPay knowledge base
- **Source Citation** with clickable references
- **Responsive UI** with Vercel Geist design
- **AWS EC2** backend with load balancing

## 🛠 Tech Stack
**Frontend**:
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Vercel Hosting

**Backend**:
- FastAPI (Python)
- FAISS Vector DB
- HuggingFace Embeddings
- AWS EC2 Deployment

## 📂 Repository Structure
```bash
.
├── frontend/                  # Next.js application
│   ├── app/
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Chat interface
│   ├── components/
│   │   ├── ui/                # ShadCN components
│   │   │   ├── button.tsx
│   │   │   └── card.tsx
│   │   └── chat/              # Chat components
│   │       ├── Input.tsx
│   │       └── Messages.tsx
│   ├── lib/
│   │   ├── api.ts             # API client
│   │   └── constants.ts       # App constants
│   ├── public/                # Static assets
│   │   ├── images/
│   │   └── fonts/
│   ├── styles/                # Global styles
│   │   └── globals.css
│   ├── .env.local             # Frontend env vars
│   └── next.config.mjs        # Next.js config
│
├── backend/                   # FastAPI service
│   ├── jiopay_index/          # Vector database
│   │   ├── index.faiss
│   │   └── index.pkl
│   ├── main.py                # API endpoints
│   ├── scraper/               # Data ingestion
│   │   └── jiopay_scraper.py
│   ├── requirements.txt       # Python dependencies
│   └── .env                   # Backend secrets
│
├── .github/                   # CI/CD workflows
│   └── workflows/
│       ├── frontend.yml
│       └── backend.yml
│
├── docs/                      # Documentation
│   ├── ARCHITECTURE.md
│   └── API_REFERENCE.md
│
├── .gitignore
├── LICENSE
└── README.md                  # This file
```

## 🚀 Deployment

### Frontend (Vercel)
```bash
cd frontend
npm install
vercel --prod
```

### Backend (AWS EC2)
```bash
cd backend
python -m pip install -r requirements.txt
gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app
```

## 🔌 API Endpoints
**POST /query**
```json
{
  "query": "How to check JioPay balance?"
}
```
**Response:**
```json
{
  "answer": "You can check balance by...",
  "sources": ["https://jiopay.com/balance"]
}
```

## 📊 Monitoring
```bash
# Frontend logs
vercel logs

# Backend logs
journalctl -u jiopay-backend -f
```
![image](https://github.com/user-attachments/assets/92275579-d83f-4a7e-a8dc-6cb01ee26429)
