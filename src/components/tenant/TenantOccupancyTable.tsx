import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface FloorOccupancy {
  id: string;
  floor: string;
  type: string;
  square_meters_available: number;
  square_meters_occupied: number;
}

export const TenantOccupancyTable = () => {
  const { user } = useAuth();
  const [floorData, setFloorData] = useState<FloorOccupancy[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFloorOccupancy = async () => {
    try {
      if (!user?.tenant_login_id) return;

      // Get tenant's floors
      const { data: tenantData, error: tenantError } = await supabase
        .from('tenants')
        .select('floor')
        .eq('tenant_id', user.tenant_login_id)
        .single();

      if (tenantError) throw tenantError;

      if (tenantData?.floor) {
        // Fetch floor occupancy data for tenant's floors
        const { data, error } = await supabase
          .from('floor_occupancy')
          .select('*')
          .in('floor', tenantData.floor)
          .order('floor');

        if (error) throw error;
        setFloorData(data || []);
      }
    } catch (error) {
      console.error('Error fetching floor occupancy:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFloorOccupancy();
  }, [user]);

  const calculateOccupancyPercentage = (occupied: number, available: number) => {
    if (available === 0) return 0;
    return Math.round((occupied / available) * 100);
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading floor occupancy...</div>;
  }

  if (floorData.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No floor occupancy data found for your floors.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Floor</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Square Meters Available</TableHead>
          <TableHead>Square Meters Occupied</TableHead>
          <TableHead>Percentage of Occupancy</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {floorData.map((floor) => {
          const occupancyPercentage = calculateOccupancyPercentage(
            floor.square_meters_occupied, 
            floor.square_meters_available
          );
          return (
            <TableRow key={floor.id}>
              <TableCell className="font-medium">{floor.floor}</TableCell>
              <TableCell>{floor.type}</TableCell>
              <TableCell>{floor.square_meters_available.toLocaleString()} m²</TableCell>
              <TableCell>{floor.square_meters_occupied.toLocaleString()} m²</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{occupancyPercentage}%</span>
                  <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full transition-all" 
                      style={{ width: `${occupancyPercentage}%` }} 
                    />
                  </div>
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};