import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import CountrySelector from '../components/CountrySelector';
import CustomSelect from '../components/CustomSelect';
import { professions } from '../data/professions';
import { countries } from '../data/countries';
import { supabase } from '../supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiPhone, FiBookOpen, FiBriefcase, FiClock, FiMapPin, FiCheckCircle, FiChevronRight, FiMail, FiGift, FiChevronDown, FiSearch } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { trackButtonClick } from '../utils/analytics';
import { useAuthModal } from '../contexts/AuthModalContext';

const countryOptions = [
  { name: 'Saudi Arabia', code: 'SA' },
  { name: 'Qatar', code: 'QA' },
  { name: 'UAE (Dubai/Abu Dhabi/MOHAP)', code: 'AE' },
];

const qualificationOptions = [
  'MBBS', 'MD', 'BDS', 'BSc', 'MSc', 'PharmD', 'DPT', 'Diploma', 'Fellowship', 'PhD', 'Other (please specify)', 'Student'
];

const genderOptions = [
  { value: 'Male', label: 'Male' },
  { value: 'Female', label: 'Female' },
  { value: 'Other', label: 'Other' },
];

const steps = [
  'country',
  'name',
  'gender',
  'phone',
  'qualification',
  'profession',
  'years',
  'summary',
];

const stepMeta = [
  { icon: <FiMapPin className="w-6 h-6 text-cyan-400 mr-2" />, title: 'Country Applying For', helper: 'Where do you want to get licensed?' },
  { icon: <FiUser className="w-6 h-6 text-cyan-400 mr-2" />, title: 'Your Name', helper: 'Let us know what to call you.' },
  { icon: <FiUser className="w-6 h-6 text-cyan-400 mr-2" />, title: 'Gender', helper: 'Select your gender.' },
  { icon: <FiPhone className="w-6 h-6 text-cyan-400 mr-2" />, title: 'Phone Number', helper: 'We may contact you for follow-up.' },
  { icon: <FiBookOpen className="w-6 h-6 text-cyan-400 mr-2" />, title: 'Qualification', helper: 'Choose your highest qualification.' },
  { icon: <FiBriefcase className="w-6 h-6 text-cyan-400 mr-2" />, title: 'Profession/Field', helper: 'Select your professional field.' },
  { icon: <FiClock className="w-6 h-6 text-cyan-400 mr-2" />, title: 'Years of Experience', helper: 'How many years have you worked in your field?' },
  { icon: <FiCheckCircle className="w-6 h-6 text-cyan-400 mr-2" />, title: 'Confirm Details', helper: 'Review your answers before submitting.' },
];

export default function EligibilityCheck() {
  const navigate = useNavigate();
  const { openAuthModal } = useAuthModal();
  const [user, setUser] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(countries.find(c => c.code === 'SA'));
  const [phone, setPhone] = useState('');
  const [qualification, setQualification] = useState('');
  const [qualificationOther, setQualificationOther] = useState('');
  const [profession, setProfession] = useState('');
  const [years, setYears] = useState('');
  const [applyCountry, setApplyCountry] = useState(countryOptions[0].code);
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [result, setResult] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [promotion, setPromotion] = useState(null);
  const [promoLoading, setPromoLoading] = useState(true);

  // Fetch active promotion on mount
  useEffect(() => {
    // Check if user is logged in
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    checkUser();

    const fetchPromotion = async () => {
      setPromoLoading(true);
      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .eq('show_in_promotion_modal', true)
        .eq('is_active', true)
        .eq('discount_type', 'percentage')
        .gte('valid_until', new Date().toISOString())
        .lte('valid_from', new Date().toISOString())
        .order('discount_value', { ascending: false })
        .limit(1)
        .single();
      if (!error && data) setPromotion(data);
      setPromoLoading(false);
    };
    fetchPromotion();
  }, []);

  // Eligibility logic
  const checkEligibility = () => {
    let eligible = false;
    let internee = false;
    let message = '';
    const yearsNum = parseFloat(years);
    const prof = profession.toLowerCase();
    const qual = qualification.toLowerCase();
    // New logic overrides
    if (qual.includes('student')) {
      message = 'You are not eligible for a license as a student.';
      setResult(message);
      return message;
    }
    if ((qual.includes('msc') || qual.includes('md') || qual.includes('phd') || qual.includes('fellowship')) && yearsNum < 1) {
      message = 'Congratulations! You are eligible for a full license.';
      setResult(message);
      return message;
    }
    if ((qual.includes('bs') || qual.includes('mbbs') || qual.includes('bsc') || qual.includes('pharmd') || qual.includes('dpt') || qual.includes('bds')) && yearsNum < 2 && yearsNum >= 1) {
      message = 'Congratulations! You are eligible for a full license.';
      setResult(message);
      return message;
    }
    if ((qual.includes('bs') || qual.includes('mbbs') || qual.includes('bsc') || qual.includes('pharmd') || qual.includes('dpt') || qual.includes('bds')) && yearsNum < 1) {
      message = 'You are eligible for an Internee License (paid).';
      setResult(message);
      return message;
    }
    // --- Saudi Arabia ---
    if (applyCountry === 'SA') {
      if (prof.includes('physician') || prof.includes('doctor')) {
        if (qual.includes('bs') || qual.includes('mbbs') || qual.includes('md')) {
          if (yearsNum >= 2) eligible = true;
          else if (yearsNum > 0) internee = true;
        }
      } else if (prof.includes('allied') || prof.includes('therapist') || prof.includes('technologist') || prof.includes('technician') || prof.includes('nurse') || prof.includes('lab')) {
        if (yearsNum >= 1) eligible = true;
        else if (yearsNum > 0) internee = true;
      } else {
        if (yearsNum >= 1) eligible = true;
        else if (yearsNum > 0) internee = true;
      }
    }
    // --- Qatar ---
    else if (applyCountry === 'QA') {
      if (prof.includes('physician') || prof.includes('doctor')) {
        if (qual.includes('bs') || qual.includes('mbbs') || qual.includes('md')) {
          if (yearsNum >= 5) eligible = true;
          else if (yearsNum > 0) internee = true;
        }
      } else if (prof.includes('allied') || prof.includes('therapist') || prof.includes('technologist') || prof.includes('technician') || prof.includes('nurse') || prof.includes('lab')) {
        if (yearsNum >= 2) eligible = true;
        else if (yearsNum > 0) internee = true;
      } else {
        if (yearsNum >= 2) eligible = true;
        else if (yearsNum > 0) internee = true;
      }
    }
    // --- UAE ---
    else if (applyCountry === 'AE') {
      if (prof.includes('physician') || prof.includes('doctor')) {
        if (qual.includes('bs') || qual.includes('mbbs') || qual.includes('md')) {
          if (yearsNum >= 2) eligible = true;
          else if (yearsNum > 0) internee = true;
        }
      } else if (prof.includes('allied') || prof.includes('therapist') || prof.includes('technologist') || prof.includes('technician') || prof.includes('nurse') || prof.includes('lab')) {
        if (yearsNum >= 2) eligible = true;
        else if (yearsNum > 0) internee = true;
      } else {
        if (yearsNum >= 2) eligible = true;
        else if (yearsNum > 0) internee = true;
      }
    }
    if (eligible) message = 'Congratulations! You are eligible for a full license.';
    else if (internee) message = 'You are eligible for an Internee License (paid).';
    else message = 'You may not be eligible for a license at this time. Please contact us for a personalized assessment.';
    setResult(message);
    return message;
  };

  const handleNext = () => setStep(s => Math.min(s + 1, steps.length - 1));
  const handleBack = () => setStep(s => Math.max(s - 1, 0));

  const isStepValid = () => {
    switch (step) {
      case 0: return !!applyCountry;
      case 1: return !!name;
      case 2: return !!gender;
      case 3: return !!phone;
      case 4: return !!qualification && (qualification !== 'Other (please specify)' || !!qualificationOther);
      case 5: return !!profession;
      case 6: return !!years;
      default: return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const qualificationValue = qualification === 'Other (please specify)' ? qualificationOther : qualification;
    const eligibilityResult = checkEligibility();
    // Save to Supabase
    const { error } = await supabase.from('eligibility_check_leads').insert([
      {
        name,
        gender,
        phone: `${selectedCountry.phoneCode} ${phone}`,
        country_code: selectedCountry.code,
        qualification: qualificationValue,
        profession,
        years_experience: years,
        applying_country: applyCountry,
        eligibility_result: eligibilityResult,
      }
    ]);
    setLoading(false);
    if (!error) {
      setSuccess(true);
      setStep(step + 1); // Show result
    } else {
      setSuccess(false);
      alert('There was an error saving your information. Please try again.');
    }
  };

  return (
    <>
      <Helmet>
        <title>Eligibility Check | Hiaraise</title>
        <meta name="description" content="Check your eligibility for a medical license in Saudi Arabia, Qatar, or UAE. Instant results based on your field, qualification, and experience." />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Eligibility Check | Hiaraise",
          "description": "Check your eligibility for a medical license in Saudi Arabia, Qatar, or UAE. Instant results based on your field, qualification, and experience.",
          "url": "https://app.hiaraise.com/eligibility-check",
          "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://app.hiaraise.com/" },
              { "@type": "ListItem", "position": 2, "name": "Eligibility Check", "item": "https://app.hiaraise.com/eligibility-check" }
            ]
          },
          "publisher": {
            "@type": "Organization",
            "name": "Hiaraise AI",
            "url": "https://app.hiaraise.com/",
            "logo": {
              "@type": "ImageObject",
              "url": "https://app.hiaraise.com/logo.png"
            }
          }
        })}</script>
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "Can I get a medical license in Saudi Arabia, Qatar, or UAE?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Use our eligibility checker to instantly see if you qualify for a medical license in Saudi Arabia, Qatar, or UAE based on your field, qualification, and experience."
              }
            },
            {
              "@type": "Question",
              "name": "What information do I need to check my eligibility?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "You will need to provide your country, name, gender, phone, qualification, profession, and years of experience."
              }
            },
            {
              "@type": "Question",
              "name": "What happens after I check my eligibility?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "If you are eligible, you can start your license process immediately. If not, you can register for tailored services or contact us for a personalized assessment."
              }
            }
          ]
        })}</script>
      </Helmet>
      <div className="max-w-xl mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-6 text-center">Can I Get a License?</h1>
        <div className="mb-6 flex items-center justify-center space-x-2">
          {steps.map((s, i) => (
            <div key={s} className={`w-6 h-2 rounded-full transition-all duration-300 ${i <= step ? 'bg-blue-500' : 'bg-gray-600'}`}></div>
          ))}
        </div>
        {promoLoading ? (
          <div className="mb-8 p-4 rounded-2xl bg-gradient-to-r from-red-900 via-purple-900 to-indigo-900 border-2 border-red-500/30 shadow-lg animate-pulse h-24" />
        ) : promotion && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-4 rounded-2xl bg-gradient-to-r from-red-900 via-purple-900 to-indigo-900 border-2 border-red-500/30 shadow-lg relative overflow-hidden"
          >
            <div className="flex items-center mb-2">
              <FiGift className="w-6 h-6 text-yellow-400 mr-2" />
              <span className="text-lg font-bold text-white">{promotion.promotion_modal_title || `${promotion.discount_value}% OFF - Limited Time!`}</span>
            </div>
            <div className="text-gray-200 mb-2">{promotion.promotion_modal_description || `Claim your exclusive discount before it expires!`}</div>
            <div className="flex items-center space-x-4">
              <span className="bg-gradient-to-r from-red-400 to-orange-500 text-white font-mono text-lg font-bold px-4 py-2 rounded-lg animate-pulse">{promotion.discount_value}% OFF</span>
              <button
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-full font-bold text-base shadow-lg hover:from-blue-700 hover:to-indigo-800 transition-all duration-300 transform hover:scale-105"
                onClick={() => {
                  if (user) {
                    // User is logged in, redirect to dashboard
                    navigate('/dashboard/user');
                  } else {
                    // User is not logged in, open auth modal
                    openAuthModal('register', () => {
                      navigate('/dashboard/user');
                    });
                  }
                }}
              >
                Register & Claim Offer
              </button>
            </div>
            <div className="text-xs text-red-300 mt-2">Expires: {promotion.valid_until ? new Date(promotion.valid_until).toLocaleString() : 'soon'} • Limited spots!</div>
          </motion.div>
        )}
        <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 mb-8 min-h-[340px] flex flex-col justify-center">
          <AnimatePresence mode="wait">
            {step < 7 && (
              <motion.div key={step} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.4 }}>
                <div className="flex items-center mb-2">
                  {stepMeta[step].icon}
                  <span className="text-lg font-bold text-white">{stepMeta[step].title}</span>
                </div>
                <div className="text-gray-400 text-sm mb-4">{stepMeta[step].helper}</div>
                {step === 0 && (
                  <CustomSelect
                    options={countryOptions.map(c => ({ value: c.code, label: c.name }))}
                    value={applyCountry}
                    onChange={setApplyCountry}
                    placeholder="Select your country"
                    className="w-full"
                    searchable
                  />
                )}
                {step === 1 && (
                  <input type="text" className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none" placeholder="Enter your name" value={name} onChange={e => setName(e.target.value)} required />
                )}
                {step === 2 && (
                  <CustomSelect
                    options={genderOptions}
                    value={gender}
                    onChange={setGender}
                    placeholder="Select gender"
                    className="w-full"
                  />
                )}
                {step === 3 && (
                  <div className="flex space-x-2">
                    <CountrySelector selectedCountry={selectedCountry} onCountrySelect={setSelectedCountry} />
                    <input type="tel" className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none" placeholder="Enter phone number" value={phone} onChange={e => setPhone(e.target.value)} required />
                  </div>
                )}
                {step === 4 && (
                  <CustomSelect
                    options={qualificationOptions.map(q => ({ value: q, label: q }))}
                    value={qualification}
                    onChange={setQualification}
                    placeholder="Select your qualification"
                    className="w-full"
                    searchable
                  />
                )}
                {step === 5 && (
                  <CustomSelect
                    options={professions.map(p => ({ value: p, label: p }))}
                    value={profession}
                    onChange={setProfession}
                    placeholder="Select your profession"
                    className="w-full"
                    searchable
                  />
                )}
                {step === 6 && (
                  <input type="number" min="0" step="0.1" className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none" placeholder="e.g. 2" value={years} onChange={e => setYears(e.target.value)} required />
                )}
                <div className="mt-6 flex justify-between">
                  <button type="button" className="px-6 py-2 rounded-xl bg-gray-600 text-white font-bold shadow hover:bg-gray-700 transition" onClick={handleBack}>Back</button>
                  <button type="button" className="px-6 py-2 rounded-xl bg-blue-600 text-white font-bold shadow hover:bg-blue-700 transition" onClick={handleNext} disabled={!isStepValid()}>Next</button>
                </div>
              </motion.div>
            )}
            {step === 7 && (
              <motion.div key="summary" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.4 }}>
                <h2 className="text-xl font-bold text-white mb-4">Confirm Your Details</h2>
                <ul className="text-gray-200 mb-6 space-y-1">
                  <li><b>Country Applying For:</b> {countryOptions.find(c => c.code === applyCountry)?.name}</li>
                  <li><b>Name:</b> {name}</li>
                  <li><b>Gender:</b> {gender}</li>
                  <li><b>Phone:</b> {selectedCountry.phoneCode} {phone}</li>
                  <li><b>Qualification:</b> {qualification === 'Other (please specify)' ? qualificationOther : qualification}</li>
                  <li><b>Profession:</b> {profession}</li>
                  <li><b>Years of Experience:</b> {years}</li>
                </ul>
                <div className="flex justify-between">
                  <button type="button" className="px-6 py-2 rounded-xl bg-gray-600 text-white font-bold shadow hover:bg-gray-700 transition" onClick={handleBack}>Back</button>
                  <button type="submit" className="px-6 py-2 rounded-xl bg-green-600 text-white font-bold shadow hover:bg-green-700 transition" disabled={loading}>{loading ? 'Checking...' : 'Check Eligibility'}</button>
                </div>
              </motion.div>
            )}
            {step === 8 && result && (
              <motion.div key="result" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} transition={{ duration: 0.5 }}>
                <div className="text-center bg-white/10 border border-white/20 rounded-2xl p-6 text-lg text-cyan-200 font-semibold shadow-lg animate-fade-in">
                  {result}
                  {(result.includes('full license') || result.includes('Internee License')) ? (
                    <>
                      <div className="mt-4">
                        <button
                          className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-full font-bold text-lg shadow-lg hover:from-blue-700 hover:to-indigo-800 transition-all duration-300 transform hover:scale-105"
                          onClick={() => navigate('/start-license')}
                        >
                          Start License Process Now
                        </button>
                      </div>
                      {/* Confetti animation */}
                      <div className="fixed inset-0 pointer-events-none z-50">
                        <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0 }}>
                          <g>
                            {[...Array(30)].map((_, i) => (
                              <circle key={i} cx={Math.random() * 100 + '%'} cy={Math.random() * 100 + '%'} r={Math.random() * 4 + 2} fill={`hsl(${Math.random() * 360},80%,60%)`} opacity="0.7" />
                            ))}
                          </g>
                        </svg>
                      </div>
                    </>
                  ) : (
                    <div className="mt-4 flex flex-col items-center">
                      <div className="text-yellow-300 font-bold mb-2">Not eligible for direct license yet?</div>
                      <button
                        className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-full font-bold text-lg shadow-lg hover:from-blue-700 hover:to-indigo-800 transition-all duration-300 transform hover:scale-105 mb-2"
                        onClick={() => {
                          if (user) {
                            // User is logged in, redirect to dashboard
                            navigate('/dashboard/user');
                          } else {
                            // User is not logged in, open auth modal
                            openAuthModal('register', () => {
                              navigate('/dashboard/user');
                            });
                          }
                        }}
                      >
                        Register Account
                      </button>
                      <a
                        href="/contact"
                        className="inline-flex items-center text-cyan-300 hover:text-cyan-200 font-semibold text-base mt-1"
                      >
                        <FiMail className="mr-2" /> Contact us for tailored services
                      </a>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </div>
      <WhoShouldGetLicenseSection />
    </>
  );
}

export function WhoShouldGetLicenseSection() {
  const [expanded, setExpanded] = useState(false);
  const [search, setSearch] = useState('');
  const filtered = professions.filter(p => p.toLowerCase().includes(search.toLowerCase()));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-xl mx-auto mt-12 mb-12"
    >
      <motion.div
        className="rounded-2xl bg-gradient-to-r from-blue-900/90 via-purple-900/90 to-indigo-900/90 border border-blue-500/30 shadow-2xl p-6"
        whileHover={{ scale: 1.01, boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)' }}
      >
        <div className="flex items-center justify-between cursor-pointer" onClick={() => setExpanded(e => !e)}>
          <h2 className="text-xl font-bold text-cyan-300 flex items-center">
            <FiCheckCircle className="mr-2 text-cyan-400" /> Who should get a license?
          </h2>
          <button className="text-cyan-200 text-sm font-semibold px-3 py-1 rounded-lg bg-cyan-800/40 hover:bg-cyan-700/60 transition-all">
            {expanded ? 'Hide List' : 'Show List'}
          </button>
        </div>
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4 }}
              className="overflow-hidden mt-4"
            >
              <p className="text-gray-200 mb-3">Getting a medical license in the Gulf region opens doors to high-paying jobs, career growth, and international recognition. <span className="font-semibold text-cyan-200">{professions.length} professions</span> are eligible:</p>
              <div className="mb-4 flex items-center">
                <FiSearch className="text-cyan-400 mr-2" />
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search profession..."
                  className="w-full px-3 py-2 rounded-lg bg-gray-900/80 border border-cyan-700/30 text-cyan-100 placeholder-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 text-sm"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-72 overflow-y-auto custom-scrollbar">
                {filtered.map((prof, i) => (
                  <motion.div
                    key={prof}
                    whileHover={{ scale: 1.03, backgroundColor: 'rgba(34,211,238,0.12)' }}
                    className="flex items-center px-3 py-2 rounded-lg bg-cyan-800/40 text-cyan-100 text-sm font-medium shadow-sm border border-cyan-600/20 transition-all cursor-pointer"
                  >
                    <FiCheckCircle className="mr-2 text-cyan-400" /> {prof}
                  </motion.div>
                ))}
                {filtered.length === 0 && (
                  <div className="col-span-2 text-cyan-300 text-center py-4">No professions found.</div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      
      {/* WhatsApp Floating Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 1 }}
        className="fixed bottom-6 right-6 z-40"
      >
        <a
          href={`https://wa.me/923097273740?text=${encodeURIComponent('Hi Hiaraise team, I need help checking my eligibility for medical licensing.')}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackButtonClick('whatsapp_contact_eligibility_floating', 'eligibility_page')}
          className="group relative w-14 h-14 rounded-full flex items-center justify-center text-white bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-emerald-500/50"
          aria-label="Contact us on WhatsApp"
        >
          <FaWhatsapp className="w-7 h-7" aria-hidden="true" />
          
          {/* Tooltip */}
          <div className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg px-3 py-2 text-sm text-white whitespace-nowrap shadow-lg animate-pulse">
              Contact us on WhatsApp
              <div className="absolute left-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-4 border-l-white/10 border-t-4 border-t-transparent border-b-4 border-b-transparent"></div>
            </div>
          </div>
        </a>
      </motion.div>
    </motion.div>
  );
} 