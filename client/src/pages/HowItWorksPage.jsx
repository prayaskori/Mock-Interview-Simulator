import { FiCpu, FiMessageSquare, FiTrendingUp, FiCheckCircle } from 'react-icons/fi';

export default function HowItWorksPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 sm:px-8">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-extrabold text-[#0f172a] tracking-tight mb-4">How It Works</h1>
        <p className="text-slate-500 text-lg">Understand the engine driving your mock interview evaluations.</p>
      </div>

      <div className="space-y-12 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
        
        {/* Step 1 */}
        <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
          <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-[#0d9488] text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 relative z-10">
            <FiCpu />
          </div>
          <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] card p-6 bg-white border-slate-200">
            <h3 className="font-bold text-[#0f172a] text-lg mb-2">1. Dynamic Generation</h3>
            <p className="text-slate-600 text-sm">We prompt the OpenAI LLM with your selected Role, Difficulty, and Interviwer Persona to generate a unique technical question avoiding any repeats.</p>
          </div>
        </div>

        {/* Step 2 */}
        <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
          <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-[#0f172a] text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 relative z-10">
            <FiMessageSquare />
          </div>
          <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] card p-6 bg-white border-slate-200">
            <h3 className="font-bold text-[#0f172a] text-lg mb-2">2. Persona Evaluation</h3>
            <p className="text-slate-600 text-sm">When you submit your answer, the model assumes the strictness of the chosen persona and parses your technical accuracy, grading you from 0-10.</p>
          </div>
        </div>

        {/* Step 3 */}
        <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
          <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-emerald-600 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 relative z-10">
            <FiTrendingUp />
          </div>
          <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] card p-6 bg-white border-slate-200">
            <h3 className="font-bold text-[#0f172a] text-lg mb-2">3. Actionable Insights</h3>
            <p className="text-slate-600 text-sm">The response is formatted securely into JSON containing explicit Strengths, Missing Concepts, and Actionable Suggestions delivered back to the React UI.</p>
          </div>
        </div>

      </div>
    </div>
  );
}
