import React from 'react';
import { ArrowRight, Shield, Globe, Zap, Code, Database, Heart, Stethoscope, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import logo from "../assets/LOGO.png"
const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const handleLogin = () => {
    console.log('Navigate to login');
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-blue-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <img 
            src={logo} 
            alt="App Logo" 
            className="h-20 w-20 mx-auto" // adjust size as needed
          />
              {/* <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
                
                {/* <Code className="w-6 h-6 text-white" /> */}
              {/* </div>  */}
              <div>
                <h1 className="text-xl font-bold text-blue-900">AyushLINK</h1>
                <p className="text-xs text-blue-600">Unifying AYUSH with World Standards</p>
              </div>
            </div>
            <button
              onClick={handleLogin}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Login
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-8">
            <Zap className="w-4 h-4 mr-2" />
            Smart India Hackathon 2025
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-blue-900 mb-6 leading-tight">
            Bridging Traditional &
            <span className="text-blue-600 block">Modern Medicine</span>
          </h1>

          <p className="text-xl text-blue-700 mb-8 max-w-3xl mx-auto leading-relaxed">
            A lightweight FHIR R4-compliant terminology microservice that seamlessly integrates 
            India's NAMASTE (Ayurveda/Siddha/Unani) codes with WHO ICD-11, enabling dual coding 
            within EMR Problem Lists for comprehensive healthcare documentation.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button onClick={handleLogin} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 flex items-center">
              Explore Demo
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
            <button className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200">
              View Documentation
            </button>
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">
              The Challenge We're Solving
            </h2>
            <p className="text-lg text-blue-700 max-w-2xl mx-auto">
              Traditional medicine systems lack standardized integration with modern EMR systems, 
              limiting insurance claims, continuity of care, and national health reporting.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Heart className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-blue-900 mb-2">Fragmented Healthcare Records</h3>
                  <p className="text-blue-700">Traditional medicine diagnoses remain isolated from global health standards, preventing comprehensive patient care tracking.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Shield className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-blue-900 mb-2">Insurance & Claims Challenges</h3>
                  <p className="text-blue-700">Lack of standardized coding prevents traditional medicine treatments from being properly documented for insurance purposes.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Database className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-blue-900 mb-2">National Health Reporting Gaps</h3>
                  <p className="text-blue-700">Without dual coding, India's rich traditional medicine practice data remains invisible in national health analytics.</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Our Solution</h3>
              <p className="text-blue-100 mb-6 leading-relaxed">
                A FHIR-compliant microservice that creates seamless bridges between NAMASTE traditional 
                medicine codes and WHO ICD-11 standards, enabling dual coding for complete healthcare documentation.
              </p>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Globe className="w-5 h-5 text-blue-200" />
                  <span className="text-blue-100">WHO ICD-11 Integration</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Stethoscope className="w-5 h-5 text-blue-200" />
                  <span className="text-blue-100">NAMASTE Code Support</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Code className="w-5 h-5 text-blue-200" />
                  <span className="text-blue-100">FHIR R4 Compliant</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-16 bg-blue-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">
              Core Capabilities
            </h2>
            <p className="text-lg text-blue-700">
              Advanced FHIR terminology operations with seamless traditional-modern medicine integration
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 border border-blue-100">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-blue-900 mb-3">Smart Autocomplete</h3>
              <p className="text-blue-700 mb-4">ValueSet $expand operations provide intelligent search suggestions combining NAMASTE and ICD-11 terminology.</p>
              <div className="text-sm text-blue-600 font-medium">FHIR $expand • Real-time search</div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 border border-blue-100">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Globe className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-blue-900 mb-3">Code Translation</h3>
              <p className="text-blue-700 mb-4">ConceptMap $translate operations seamlessly convert NAMASTE codes to ICD-11 equivalents with provenance tracking.</p>
              <div className="text-sm text-blue-600 font-medium">FHIR $translate • Bidirectional mapping</div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 border border-blue-100">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-blue-900 mb-3">ABDM Integration</h3>
              <p className="text-blue-700 mb-4">ABHA-linked security with OAuth flows ensuring compliant health data exchange within India's digital ecosystem.</p>
              <div className="text-sm text-blue-600 font-medium">OAuth 2.0 • ABDM Compliant</div>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Stack */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">
              Built for Scale & Standards
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-blue-900 mb-6">Technical Excellence</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span className="text-blue-700"><strong>FHIR R4:</strong> CodeSystem, ValueSet, ConceptMap operations</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span className="text-blue-700"><strong>WHO ICD-11 API:</strong> Real-time synchronization with OAuth v2</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span className="text-blue-700"><strong>Performance:</strong> In-memory caching with Prometheus metrics</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span className="text-blue-700"><strong>Security:</strong> TLS encryption with JWT authentication</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-2xl p-8 text-white">
              <h3 className="text-xl font-bold mb-4">API Operations</h3>
              <div className="space-y-3 font-mono text-sm">
                <div className="bg-blue-800/50 rounded p-2">
                  <span className="text-blue-200">GET</span> /ValueSet/$expand
                </div>
                <div className="bg-blue-800/50 rounded p-2">
                  <span className="text-green-200">POST</span> /ConceptMap/$translate
                </div>
                <div className="bg-blue-800/50 rounded p-2">
                  <span className="text-blue-200">GET</span> /CodeSystem/$lookup
                </div>
                <div className="bg-blue-800/50 rounded p-2">
                  <span className="text-green-200">POST</span> /Condition
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Transform Healthcare Integration?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Experience the future of traditional and modern medicine integration with our FHIR-compliant platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={handleLogin}
              className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
            >
              Start Demo
            </button>
            <button className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200">
              View on GitHub
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-900 text-blue-100 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <img 
            src={logo} 
            alt="App Logo" 
            className="h-20 w-20 mx-auto" // adjust size as needed
          />
              {/* <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Code className="w-5 h-5 text-white" />
              </div> */}
              <div>
                <div className="font-bold text-white">AyushLINK</div>
                <div className="text-xs text-blue-300">Unifying AYUSH with World Standards</div>
              </div>
            </div>
            <div className="text-sm text-blue-300">
              Built with FHIR R4 • WHO ICD-11 • Indian EHR Compliance
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;