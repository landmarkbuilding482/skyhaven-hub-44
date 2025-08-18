import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Target, Award, Users2 } from "lucide-react";

const About = () => {
  const stats = [
    { label: "Total Floors", value: "15" },
    { label: "Office Spaces", value: "120" },
    { label: "Retail Units", value: "25" },
    { label: "Parking Spaces", value: "200" },
  ];

  const amenities = [
    "High-speed fiber internet",
    "24/7 security and access control",
    "Professional cleaning services",
    "Modern elevator systems",
    "Climate-controlled environment",
    "Rooftop event space",
    "Ground floor retail and dining",
    "Conference room facilities",
    "On-site parking garage",
    "Emergency backup systems",
  ];

  return (
    <div className="container mx-auto px-4 py-16 space-y-16">
      {/* Header */}
      <section className="text-center">
        <h1 className="text-4xl font-bold text-foreground mb-6">About Landmark Building</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          A premier commercial property offering world-class office spaces, retail opportunities, 
          and event venues with exceptional management and modern amenities.
        </p>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((stat, index) => (
          <Card key={index} className="text-center">
            <CardHeader className="pb-2">
              <CardTitle className="text-3xl font-bold text-primary">{stat.value}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* Mission & Vision */}
      <section className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <Target className="h-12 w-12 text-primary mb-4" />
            <CardTitle>Our Mission</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              To provide exceptional commercial spaces that foster business growth and success. 
              We are committed to maintaining the highest standards of service, security, and 
              building management to create an environment where businesses thrive.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Award className="h-12 w-12 text-primary mb-4" />
            <CardTitle>Our Vision</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              To be the premier destination for businesses seeking modern, well-managed commercial 
              spaces in the city. We strive to create a vibrant community of diverse businesses 
              while setting the standard for commercial property management.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Building Features */}
      <section>
        <Card>
          <CardHeader>
            <Building2 className="h-12 w-12 text-primary mb-4" />
            <CardTitle>Building Specifications</CardTitle>
            <CardDescription>
              Landmark Building is a 15-story modern commercial complex featuring premium amenities
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="font-semibold mb-3">Floor Distribution:</h4>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-muted p-4 rounded-lg">
                  <h5 className="font-medium">Ground Floor</h5>
                  <p className="text-sm text-muted-foreground">Retail spaces, lobby, visitor reception</p>
                </div>
                <div className="bg-muted p-4 rounded-lg">
                  <h5 className="font-medium">Floors 2-14</h5>
                  <p className="text-sm text-muted-foreground">Office spaces of various sizes</p>
                </div>
                <div className="bg-muted p-4 rounded-lg">
                  <h5 className="font-medium">Floor 15</h5>
                  <p className="text-sm text-muted-foreground">Rooftop event space and amenities</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Amenities & Services:</h4>
              <div className="flex flex-wrap gap-2">
                {amenities.map((amenity, index) => (
                  <Badge key={index} variant="secondary">{amenity}</Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Management Team */}
      <section>
        <Card>
          <CardHeader>
            <Users2 className="h-12 w-12 text-primary mb-4" />
            <CardTitle>Professional Management</CardTitle>
            <CardDescription>
              Our experienced team ensures smooth operations and exceptional tenant satisfaction
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold">Property Management</h4>
                <ul className="text-sm text-muted-foreground space-y-1 mt-2">
                  <li>• Daily building operations oversight</li>
                  <li>• Tenant relations and support</li>
                  <li>• Lease administration</li>
                  <li>• Financial reporting and analysis</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold">Maintenance & Security</h4>
                <ul className="text-sm text-muted-foreground space-y-1 mt-2">
                  <li>• 24/7 security monitoring</li>
                  <li>• Preventive maintenance programs</li>
                  <li>• Emergency response protocols</li>
                  <li>• Cleaning and janitorial services</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default About;