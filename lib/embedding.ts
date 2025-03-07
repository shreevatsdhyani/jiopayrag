import { embed } from "ai"
import { openai } from "@ai-sdk/openai"

// This would be a real database in production
const mockKnowledgeBase = [
  {
    title: "What is JioPay?",
    url: "/faqs/what-is-jiopay",
    content:
      "JioPay is a digital payment solution that allows users to make secure payments, transfer money, pay bills, and more using their smartphone. It's designed to make digital transactions simple, fast, and secure.",
  },
  {
    title: "How to create a JioPay account",
    url: "/faqs/create-account",
    content:
      "To create a JioPay account, download the JioPay app from the App Store or Google Play Store, open the app, click on 'Sign Up', enter your mobile number, verify with OTP, set a PIN, and complete your profile details.",
  },
  {
    title: "Payment Methods",
    url: "/features/payment-methods",
    content:
      "JioPay supports multiple payment methods including UPI, debit cards, credit cards, net banking, and JioPay wallet. You can add and manage your payment methods in the 'Payment Methods' section of the app.",
  },
  {
    title: "Transaction Limits",
    url: "/faqs/transaction-limits",
    content:
      "JioPay has daily transaction limits that vary based on your verification level. Basic accounts can transact up to ₹10,000 per day, while fully verified accounts can transact up to ₹1,00,000 per day.",
  },
  {
    title: "Security Features",
    url: "/features/security",
    content:
      "JioPay uses advanced security measures including end-to-end encryption, two-factor authentication, and PIN/biometric protection for all transactions. We also have 24/7 fraud monitoring to keep your money safe.",
  },
]

const embeddingModel = openai.embedding("text-embedding-ada-002")

export const generateEmbedding = async (value: string): Promise<number[]> => {
  const input = value.replaceAll("\\n", " ")
  const { embedding } = await embed({
    model: embeddingModel,
    value: input,
  })
  return embedding
}

// In a real implementation, this would search a vector database
export const findRelevantContent = async (userQuery: string) => {
  // For demo purposes, we're using a simple keyword matching approach
  // In a real implementation, this would use vector similarity search
  const query = userQuery.toLowerCase()

  const relevantSources = mockKnowledgeBase.filter((item) => {
    const content = item.content.toLowerCase()
    const title = item.title.toLowerCase()

    // Simple keyword matching
    return query.split(" ").some((word) => word.length > 3 && (content.includes(word) || title.includes(word)))
  })

  // Return the top 2 most relevant sources
  return relevantSources.slice(0, 2)
}

