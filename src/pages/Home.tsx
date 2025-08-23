import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Building, Users, BarChart3, Shield, Clock, MapPin, MessageSquare, AlertTriangle, Lightbulb } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { FeedbackSubmissionDialog } from "@/components/feedback/FeedbackSubmissionDialog";

const Home = () => {
  const { user } = useAuth();
  const [feedbackDialog, setFeedbackDialog] = useState<{
    isOpen: boolean;
    type: 'Feedback' | 'Complaint' | 'Suggestion';
  }>({
    isOpen: false,
    type: 'Feedback'
  });

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 to-primary/5 py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Landmark Building
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Premium office spaces, retail opportunities, and event venues in the heart of the city. 
              Experience modern amenities with professional building management services.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link to="/tenant">Tenant Portal</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">Why Choose Landmark Building?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our modern facility offers everything your business needs to thrive, with top-notch 
            management and premium amenities.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <Building className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Modern Spaces</CardTitle>
              <CardDescription>
                Contemporary office and retail spaces designed for productivity and growth
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <MapPin className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Prime Location</CardTitle>
              <CardDescription>
                Located in the city center with excellent transportation and parking access
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Users className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Professional Management</CardTitle>
              <CardDescription>
                Dedicated management team providing 24/7 support and maintenance services
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Shield className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Security & Safety</CardTitle>
              <CardDescription>
                Advanced security systems and safety protocols for peace of mind
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <BarChart3 className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Event Spaces</CardTitle>
              <CardDescription>
                Beautiful rooftop venue available for corporate events and celebrations
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Clock className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Flexible Leasing</CardTitle>
              <CardDescription>
                Customizable lease terms to meet your business needs and growth plans
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Feedback Section */}
      <section className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-4">Share Your Voice</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Help us improve by sharing your feedback, complaints, or suggestions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => setFeedbackDialog({ isOpen: true, type: 'Feedback' })}
              className="flex items-center gap-2"
            >
              <MessageSquare className="h-4 w-4" />
              Submit Feedback
            </Button>
            <Button 
              onClick={() => setFeedbackDialog({ isOpen: true, type: 'Complaint' })}
              variant="outline"
              className="flex items-center gap-2"
            >
              <AlertTriangle className="h-4 w-4" />
              File Complaint
            </Button>
            <Button 
              onClick={() => setFeedbackDialog({ isOpen: true, type: 'Suggestion' })}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Lightbulb className="h-4 w-4" />
              Share Suggestion
            </Button>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-muted py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">Ready to Join Our Community?</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Discover available spaces and see how Landmark Building can be the perfect home for your business.
          </p>
          <Button asChild size="lg">
            <Link to="/contact">Schedule a Tour</Link>
          </Button>
        </div>
      </section>

      <FeedbackSubmissionDialog
        isOpen={feedbackDialog.isOpen}
        onClose={() => setFeedbackDialog(prev => ({ ...prev, isOpen: false }))}
        feedbackType={feedbackDialog.type}
      />
    </div>
  );
};

export default Home;