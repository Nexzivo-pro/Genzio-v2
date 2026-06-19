import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import BackgroundWrapper from './components/BackgroundWrapper';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import { ThemeProvider } from './components/ThemeProvider';
import CustomCursor from './components/CustomCursor';
import Home from './pages/Home';
import Features from './pages/Features';
import About from './pages/About';
import Blog from './pages/Blog';
import Contact from './pages/Contact';
import Pricing from './pages/Pricing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfUse from './pages/TermsOfUse';
import Changelog from './pages/Changelog';
import FAQ from './pages/FAQ';
import Nexzivo from './pages/Nexzivo';
import Security from './pages/Security';
import AcceptableUsePolicy from './pages/AcceptableUsePolicy';
import Disclaimer from './pages/Disclaimer';
import AIChat from './pages/tool/AIChat';
import EmailAutomation from './pages/tool/EmailAutomation';
import EmailVerification from './pages/tool/EmailVerification';
import Analytics from './pages/tool/Analytics';
import Campaigns from './pages/tool/Campaigns';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <ThemeProvider>
      <Router>
        <CustomCursor />
        <ScrollToTop />
        <Routes>
          {/* Top Navbar Only Layout */}
          <Route path="/*" element={
            <BackgroundWrapper>
              <Navbar />
              <main className="flex-grow pt-20">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/features" element={<Features />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/pricing" element={<Pricing />} />
                  
                  {/* Protected Tool Routes */}
                  <Route path="/tool/ai-chat" element={<ProtectedRoute><AIChat /></ProtectedRoute>} />
                  <Route path="/tool/email-automation" element={<ProtectedRoute><EmailAutomation /></ProtectedRoute>} />
                  <Route path="/tool/email-verification" element={<ProtectedRoute><EmailVerification /></ProtectedRoute>} />
                  <Route path="/tool/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
                  <Route path="/tool/campaigns" element={<ProtectedRoute><Campaigns /></ProtectedRoute>} />
                  
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/privacy" element={<PrivacyPolicy />} />
                  <Route path="/terms" element={<TermsOfUse />} />
                  <Route path="/changelog" element={<Changelog />} />
                  <Route path="/faq" element={<FAQ />} />
                  <Route path="/nexzivo" element={<Nexzivo />} />
                  <Route path="/security" element={<Security />} />
                  <Route path="/acceptable-use" element={<AcceptableUsePolicy />} />
                  <Route path="/disclaimer" element={<Disclaimer />} />
                  
                  {/* Redirect dashboard visits directly to Home unified template */}
                  <Route path="/dashboard/*" element={<Navigate to="/" replace />} />
                  <Route path="/dashboard" element={<Navigate to="/" replace />} />

                  <Route path="*" element={
                    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                      <h1 className="text-6xl font-display font-bold text-neon-pink mb-4">404</h1>
                      <h2 className="text-2xl font-bold mb-4">Page not found</h2>
                      <p className="text-gray-400 mb-8">The page you are looking for doesn't exist or hasn't been built yet.</p>
                      <Link to="/" className="btn-primary">Return Home</Link>
                    </div>
                  } />
                </Routes>
              </main>
              <Footer />
            </BackgroundWrapper>
          } />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}
