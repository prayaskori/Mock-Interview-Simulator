import { FiDownload, FiChevronDown } from 'react-icons/fi';
import { useState } from 'react';

const SAMPLE_QUESTIONS = [
  {
    role: "Software Engineering",
    questions: [
      {
        q: "Explain the distinction between process and thread.",
        a: "A process is an independent program in execution with its own memory space, while a thread is a subset of a process. Multiple threads within the same process share the same memory and resources, making context switching between them much faster."
      },
      {
        q: "How does a hash map resolve collisions?",
        a: "Hash maps typically resolve collisions using either Chaining (storing a linked list or tree of elements at the same bucket index) or Open Addressing (probing for the next available slot systematically, e.g., using linear or quadratic probing)."
      },
      {
        q: "What is the Event Loop in Node.js/Javascript?",
        a: "The Event Loop is a mechanism that handles asynchronous callbacks in a single-threaded environment. It offloads operations to the system kernel whenever possible, and continuously checks the call stack and task queues to execute callbacks when the stack is empty."
      },
      {
        q: "Explain REST versus GraphQL.",
        a: "REST exposes multiple endpoints for different resources and typically over-fetches or under-fetches data. GraphQL exposes a single endpoint and allows clients to specify exactly the shape of the data they need, increasing efficiency but adding backend complexity."
      }
    ]
  },
  {
    role: "Machine Learning",
    questions: [
      {
        q: "What is the bias-variance tradeoff?",
        a: "It's the balance between a model's ability to minimize errors on training data (low bias) versus its ability to generalize to unseen test data (low variance). High bias causes underfitting, while high variance causes overfitting."
      },
      {
        q: "Explain the Transformer architecture.",
        a: "The Transformer relies entirely on self-attention mechanisms, discarding RNNs/CNNs. It processes entire sequences simultaneously, allowing for massive parallelization, and uses positional encoding to understand token order."
      },
      {
        q: "How do you handle severe class imbalance?",
        a: "Techniques include oversampling the minority class (e.g., SMOTE), undersampling the majority class, using class-weighted loss functions (like focal loss), or approaching the problem using anomaly detection algorithms."
      }
    ]
  },
  {
    role: "Data Science",
    questions: [
      {
        q: "Explain P-value and Statistical Power.",
        a: "A P-value is the probability of obtaining test results at least as extreme as the observed results, assuming the null hypothesis is true. Statistical Power (1 - Beta) is the probability that a test correctly rejects a false null hypothesis."
      },
      {
        q: "How do you design a reliable A/B test?",
        a: "You must formulate a clear hypothesis, select robust metrics (OEC), calculate the required sample size beforehand based on desired power and Minimum Detectable Effect (MDE), randomize users cleanly, and avoid peeking at results prematurely."
      },
      {
        q: "Explain PCA and its assumptions.",
        a: "Principal Component Analysis is a dimensionality reduction technique that transforms correlated variables into a smaller number of uncorrelated variables (principal components) that capture the maximum variance. It assumes linear relationships, large variances imply importance, and variables are scaled."
      }
    ]
  }
];

export default function QuestionsPage() {
  const [openItems, setOpenItems] = useState({});

  const toggleItem = (roleIdx, qIdx) => {
    const key = `${roleIdx}-${qIdx}`;
    setOpenItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 sm:px-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 border-b border-slate-200 pb-6 gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-[#0f172a] tracking-tight">Question Bank</h1>
          <p className="text-slate-500 mt-2 text-lg">Top technical questions with expert answers.</p>
        </div>
        <a 
          href="/AceIt_Interview_Questions.pdf" 
          download 
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold transition-all shadow-md bg-violet-600 text-white hover:bg-violet-700 whitespace-nowrap shrink-0"
        >
          <FiDownload /> Download PDF Guide
        </a>
      </div>

      <div className="space-y-8">
        {SAMPLE_QUESTIONS.map((section, idx) => (
          <div key={idx} className="card p-6 border-slate-200">
            <h2 className="text-xl font-bold text-[#0f172a] mb-4 border-b pb-2">{section.role}</h2>
            <div className="space-y-4">
              {section.questions.map((item, qidx) => (
                <div key={qidx} className="border border-slate-100 rounded-lg overflow-hidden bg-white shadow-sm">
                  <button 
                    onClick={() => toggleItem(idx, qidx)}
                    className="w-full text-left flex justify-between items-center p-4 bg-slate-50 hover:bg-slate-100 transition-colors"
                  >
                    <span className="font-semibold text-slate-800 flex gap-3">
                      <span className="font-bold text-[#0d9488]">Q{qidx + 1}.</span> 
                      {item.q}
                    </span>
                    <FiChevronDown className={`text-slate-500 transition-transform ${openItems[`${idx}-${qidx}`] ? 'rotate-180' : ''}`} />
                  </button>
                  {openItems[`${idx}-${qidx}`] && (
                    <div className="p-4 bg-white border-t border-slate-100 text-slate-600 text-sm leading-relaxed">
                      <strong className="text-slate-800">Expert Answer:</strong> <br/>
                      {item.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
