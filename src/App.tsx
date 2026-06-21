import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import BackgroundWrapper from './components/BackgroundWrapper';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import { ThemeProvider } from './components/ThemeProvider';
import CustomCursor from './components/CustomCursor';
import InitialLoader from './components/InitialLoader';
import DynamicTitle from './components/DynamicTitle';
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
import ProtectedRoute from './components/ProtectedRoute';

// Lazy loading tool pages
const AIChat = React.lazy(() => import('./pages/tool/AIChat'));
const EmailAutomation = React.lazy(() => import('./pages/tool/EmailAutomation'));
const EmailVerification = React.lazy(() => import('./pages/tool/EmailVerification'));
const Analytics = React.lazy(() => import('./pages/tool/Analytics'));
const Campaigns = React.lazy(() => import('./pages/tool/Campaigns'));

function SuspenseFallback() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-8 h-8 rounded-full border-2 border-neon-cyan border-t-transparent animate-spin shadow-[0_0_15px_#00f3ff]"></div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <InitialLoader />
      <Router>
        <DynamicTitle />
        <CustomCursor />
        <ScrollToTop />
        <Routes>
          {/* Top Navbar Only Layout */}
          <Route path="/*" element={
            <BackgroundWrapper>
              <Navbar />
              <main className="flex-grow pt-20">
                <Suspense fallback={<SuspenseFallback />}>
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
                </Suspense>
              </main>
              <Footer />
            </BackgroundWrapper>
          } />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}
