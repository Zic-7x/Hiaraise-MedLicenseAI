import { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { useAnalytics } from '../utils/useAnalytics';

export default function Countries() {
  useAnalytics();

  useEffect(() => {
    // No-op: analytics handled via useAnalytics
  }, []);

  const countries = [
    {
      name: 'United Arab Emirates',
      code: 'AE',
      flag: '🇦🇪',
      capital: 'Dubai/Abu Dhabi',
      population: '9.9M',
      currency: 'AED',
      licenses: [
        {
          name: 'DHA License',
          description: 'Dubai Health Authority license for healthcare professionals',
          cost: 'PKR 219,000 - 232,000',
          timeline: '8-13 weeks',
          link: '/licenses/dha-license-dubai',
          features: ['Remote application from Pakistan', 'Online exam', 'Employer pays activation fees']
        },
        {
          name: 'MOHAP License',
          description: 'UAE Ministry of Health and Prevention license for healthcare professionals',
          cost: 'PKR 185,000 - 200,000',
          timeline: '10-12 weeks',
          link: '/licenses/moh-license-uae',
          features: ['Complete process from Pakistan', 'Assessment at designated centers', 'Professional license issuance']
        }
      ],
      description: 'The UAE offers excellent opportunities for Pakistani healthcare professionals with competitive salaries and modern healthcare facilities.',
      benefits: ['High salary packages', 'Modern healthcare infrastructure', 'Tax-free income', 'Multicultural environment']
    },
    {
      name: 'Qatar',
      code: 'QA',
      flag: '🇶🇦',
      capital: 'Doha',
      population: '2.9M',
      currency: 'QAR',
      licenses: [
        {
          name: 'QCHP License',
          description: 'Qatar Council for Healthcare Practitioners license',
          cost: 'PKR 180,000 - 195,000',
          timeline: '10-12 weeks',
          link: '/licenses/qchp-license-qatar',
          features: ['QCHP portal registration', 'Assessment at centers', 'Professional license']
        }
      ],
      description: 'Qatar provides excellent career opportunities for healthcare professionals with world-class medical facilities and competitive compensation.',
      benefits: ['World Cup legacy infrastructure', 'High standard of living', 'Tax-free income', 'Growing healthcare sector']
    },
    {
      name: 'Saudi Arabia',
      code: 'SA',
      flag: '🇸🇦',
      capital: 'Riyadh',
      population: '35.3M',
      currency: 'SAR',
      licenses: [
        {
          name: 'SCFHS License',
          description: 'Saudi Commission for Health Specialties license',
          cost: 'PKR 195,000 - 210,000',
          timeline: '12-16 weeks',
          link: '/licenses/scfhs-license-saudi',
          features: ['Mumaris Plus portal', 'SMLE exam', 'Professional classification']
        }
      ],
      description: 'Saudi Arabia offers extensive career opportunities for Pakistani healthcare professionals with Vision 2030 healthcare expansion.',
      benefits: ['Vision 2030 opportunities', 'Large healthcare market', 'Competitive salaries', 'Professional development']
    }
  ];

  return (
    <>
      <Helmet>
        <title>Supported Countries | Hiaraise</title>
        <meta name="description" content="Explore supported countries for medical licensing: UAE, Qatar, and Saudi Arabia with Hiaraise." />
        <meta name="keywords" content="medical license countries, UAE license, Qatar license, Saudi Arabia license, healthcare jobs" />
      </Helmet>
      <div className="min-h-screen py-12">
        <section className="text-center py-12 mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent mb-6">
            Supported Countries
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            We currently support medical licensing pathways in these three countries for Pakistani healthcare professionals
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-400">
            <span>🌍 3 Countries</span>
            <span>🏥 4 License Types</span>
            <span>💰 Competitive Costs</span>
            <span>⚡ Fast Processing</span>
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {countries.map((country) => (
              <div key={country.code} className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300">
                {/* Country Header */}
                <div className="text-center mb-6">
                  <div className="text-4xl mb-3">{country.flag}</div>
                  <h2 className="text-2xl font-bold text-white mb-2">{country.name}</h2>
                  <div className="text-sm text-gray-400 space-y-1">
                    <div>Capital: {country.capital}</div>
                    <div>Population: {country.population}</div>
                    <div>Currency: {country.currency}</div>
                  </div>
                </div>

                {/* Country Description */}
                <div className="mb-6">
                  <p className="text-gray-300 text-sm leading-relaxed">{country.description}</p>
                </div>

                {/* Benefits */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-3">Key Benefits</h3>
                  <ul className="space-y-2">
                    {country.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-center text-sm text-gray-300">
                        <span className="text-green-400 mr-2">✓</span>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Available Licenses */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-3">Available Licenses</h3>
                  <div className="space-y-3">
                    {country.licenses.map((license, index) => (
                      <div key={index} className="bg-white/5 rounded-lg p-3 border border-white/10">
                        <h4 className="font-semibold text-white text-sm mb-1">{license.name}</h4>
                        <p className="text-gray-400 text-xs mb-2">{license.description}</p>
                        <div className="flex justify-between text-xs text-gray-300 mb-2">
                          <span>Cost: <span className="text-green-400">{license.cost}</span></span>
                          <span>Timeline: <span className="text-blue-400">{license.timeline}</span></span>
                        </div>
                        <Link
                          to={license.link}
                          className="block w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 text-center text-xs"
                        >
                          Learn More
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Call to Action */}
                <div className="text-center">
                  <Link
                    to="/licenses"
                    className="inline-block bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 text-sm"
                  >
                    View All Licenses
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Call to Action Section */}
          <section className="text-center mt-16">
            <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 backdrop-blur-xl border border-blue-500/30 rounded-2xl p-8">
              <h2 className="text-3xl font-bold text-white mb-4">Ready to Start Your International Career?</h2>
              <p className="text-lg text-gray-300 mb-6">
                Choose your destination country and begin your licensing journey with expert guidance from Hiaraise.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/start-license"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105"
                >
                  Get Started
                </Link>
                <Link
                  to="/contact"
                  className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}


