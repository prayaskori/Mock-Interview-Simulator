import { FiCheck } from 'react-icons/fi';

const TIERS = [
  {
    name: 'Starter',
    price: 'Free',
    desc: 'Perfect to try out the AI evaluation system.',
    features: ['3 Mock Interviews/month', 'Standard AI Persona', 'Basic Feedback', 'View History'],
    btnText: 'Current Plan',
    highlight: false
  },
  {
    name: 'Pro',
    price: '$12/mo',
    desc: 'For serious job seekers looking to ace interviews.',
    features: ['Unlimited Mock Interviews', 'Tough & Friendly Personas', 'ATS Resume Scanner', 'Deep Structural Feedback', 'Audio Analytics'],
    btnText: 'Upgrade to Pro',
    highlight: true
  },
  {
    name: 'Enterprise',
    price: 'Contact Us',
    desc: 'For bootcamps and universities.',
    features: ['Everything in Pro', 'Custom Question Banks', 'Student Analytics Dashboard', 'API Access', 'White-labeling'],
    btnText: 'Contact Sales',
    highlight: false
  }
];

export default function UpgradePage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12 sm:px-8 text-center">
      <h1 className="text-4xl font-extrabold text-[#0f172a] tracking-tight mb-4">Upgrade Your Prep</h1>
      <p className="text-slate-500 text-lg mb-12 max-w-2xl mx-auto">Get unlimited interviews, tough personas, and deep AI insights to practically guarantee your technical hiring success.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
        {TIERS.map((tier, idx) => (
          <div key={idx} className={`card p-8 flex flex-col ${tier.highlight ? 'border-[#0d9488] border-2 shadow-xl relative' : 'border-slate-200'}`}>
            {tier.highlight && <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#0d9488] text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Most Popular</div>}
            
            <h3 className="text-xl font-bold text-slate-900 mb-2">{tier.name}</h3>
            <div className="text-3xl font-extrabold text-[#0f172a] mb-2">{tier.price}</div>
            <p className="text-sm text-slate-500 mb-6 flex-1">{tier.desc}</p>
            
            <ul className="space-y-3 mb-8">
              {tier.features.map((f, fIdx) => (
                <li key={fIdx} className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <FiCheck className="text-[#0d9488] font-bold" /> {f}
                </li>
              ))}
            </ul>

            <button className={`w-full py-3 rounded-lg font-bold transition-all ${tier.highlight ? 'bg-[#0f172a] text-white hover:bg-[#0f172a]/90' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
              {tier.btnText}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
