import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import FeedPage from "./pages/FeedPage";
import GroupsPage from "./pages/GroupsPage";
import MessagesPage from "./pages/MessagesPage";
import PeoplePage from "./pages/PeoplePage";
import BusinessesPage from "./pages/BusinessesPage";
import CategoryPage from "./pages/CategoryPage";
import BusinessProfilePage from "./pages/BusinessProfilePage";
import GetListedPage from "./pages/GetListedPage";
import BusinessDashboard from "./pages/BusinessDashboard";
import JobsPage from "./pages/JobsPage";
import PostJobPage from "./pages/PostJobPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/community" element={<FeedPage />} />
            <Route path="/groups" element={<GroupsPage />} />
            <Route path="/messages" element={<MessagesPage />} />
            <Route path="/people" element={<PeoplePage />} />
            <Route path="/businesses" element={<BusinessesPage />} />
            <Route path="/category/:slug" element={<CategoryPage />} />
            <Route path="/business/:slug" element={<BusinessProfilePage />} />
            <Route path="/get-listed" element={<GetListedPage />} />
            <Route path="/business-dashboard" element={<BusinessDashboard />} />
            <Route path="/jobs" element={<JobsPage />} />
            <Route path="/post-job" element={<PostJobPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
