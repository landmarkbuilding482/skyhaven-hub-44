import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface PasswordChangeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  userType: 'admin' | 'tenant';
  username: string;
}

export const PasswordChangeDialog = ({ isOpen, onClose, userId, userType, username }: PasswordChangeDialogProps) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);
    
    try {
      const tableName = userType === 'admin' ? 'admin_users' : 'tenant_credentials';
      
      const { error } = await supabase
        .from(tableName)
        .update({ password_hash: newPassword }) // In production, this should be hashed
        .eq('id', userId);

      if (error) {
        toast.error(`Failed to update ${userType} password`);
        return;
      }

      toast.success(`Password updated successfully for ${username}`);
      setNewPassword("");
      setConfirmPassword("");
      onClose();
    } catch (error) {
      toast.error("An error occurred while updating the password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
          <DialogDescription>
            Change password for {userType}: {username}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
            />
          </div>
          
          <div>
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handlePasswordChange} disabled={loading}>
            {loading ? "Updating..." : "Update Password"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};