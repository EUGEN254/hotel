import { useState } from "react";
import { 
  User, 
  Mail, 
  Phone, 
  CreditCard, 
  Lock, 
  Eye, 
  EyeOff, 
  Save, 
  Edit2, 
  Star,
  Calendar,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

const GuestProfile = () => {
  const { user } = useAuth();
  // Profile state
  const [isEditing, setIsEditing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [profile, setProfile] = useState({
    fullName: user?.name || "N/A",
    email: user?.email || "N/A",
    phone: user?.phone || "N/A",
    idNumber: user?.idNumber || "N/A",
    passportNumber: user?.passportNumber || "N/A",
    nationality: user?.nationality || "N/A",
    dateOfBirth: user?.dateOfBirth || "N/A",
    preferences: user?.preferences || {
      roomType: "Any",
      extraPillows: true,
      earlyCheckIn: false,
    },
    specialRequests: user?.specialRequests || "I prefer quiet rooms away from elevator",
  });

  // Password change state
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  // VIP status (GM-04: returning guests marked as VIP)
  const isVIP = user?.isVIP || true;
  const memberSince = user?.memberSince || "2024";
  const totalStays = user?.totalStays || 8;
  const totalSpent = user?.totalSpent || 24500;

  // Handle profile changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setProfile({
        ...profile,
        preferences: {
          ...profile.preferences,
          [name]: checked,
        },
      });
    } else {
      setProfile({ ...profile, [name]: value });
    }
  };

  // Handle save profile
  const handleSaveProfile = () => {
    setIsEditing(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
    // In production: API call to update profile
    console.log("Profile saved:", profile);
  };

  // Handle password change
  const handlePasswordChange = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }
    if (passwordData.newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return;
    }
    setPasswordError("");
    setShowPasswordModal(false);
    setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
    // In production: API call to change password
    console.log("Password changed");
  };

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {showSuccess && (
        <div className="fixed top-20 right-4 z-50 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 animate-in slide-in-from-top-2">
          <CheckCircle className="w-4 h-4" />
          Changes saved successfully!
        </div>
      )}

      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">My Profile</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your personal information and preferences
          </p>
        </div>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary border border-primary rounded-lg hover:bg-primary/10 transition-colors"
          >
            <Edit2 className="w-4 h-4" />
            Edit Profile
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 text-sm font-medium border border-border rounded-lg hover:bg-secondary transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveProfile}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        )}
      </div>

      {/* VIP Banner (GM-04) */}
      {isVIP && (
        <div className="bg-gradient-to-r from-amber-500/15 to-amber-500/5 border border-amber-500/20 rounded-lg p-4 flex items-center gap-3">
          <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-foreground">VIP Member</p>
            <p className="text-xs text-muted-foreground">
              Thank you for your loyalty! You've stayed with us {totalStays} times.
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-foreground">Member since {memberSince}</p>
            <p className="text-xs text-muted-foreground">KES {totalSpent.toLocaleString()} total spent</p>
          </div>
        </div>
      )}

      {/* Profile Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card border border-border-light rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Calendar className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{totalStays}</p>
              <p className="text-xs text-muted-foreground">Total Stays</p>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border-light rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Star className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">4.8</p>
              <p className="text-xs text-muted-foreground">Average Rating</p>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border-light rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <CreditCard className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">KES {totalSpent.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Total Spent</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Profile Form */}
      <div className="bg-card border border-border-light rounded-lg overflow-hidden">
        <div className="border-b border-border-light px-6 py-4">
          <h2 className="text-lg font-semibold text-foreground">Personal Information</h2>
          <p className="text-sm text-muted-foreground">Update your personal details</p>
        </div>
        <div className="p-6 space-y-5">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Full Name <span className="text-destructive">*</span>
            </label>
            {isEditing ? (
              <input
                type="text"
                name="fullName"
                value={profile.fullName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            ) : (
              <div className="flex items-center gap-2 px-3 py-2 bg-secondary/30 rounded-lg">
                <User className="w-4 h-4 text-muted-foreground" />
                <span className="text-foreground">{profile.fullName}</span>
              </div>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Email Address <span className="text-destructive">*</span>
            </label>
            {isEditing ? (
              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            ) : (
              <div className="flex items-center gap-2 px-3 py-2 bg-secondary/30 rounded-lg">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span className="text-foreground">{profile.email}</span>
              </div>
            )}
          </div>

          {/* Phone Number (GM-01) */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Phone Number <span className="text-destructive">*</span>
            </label>
            {isEditing ? (
              <input
                type="tel"
                name="phone"
                value={profile.phone}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            ) : (
              <div className="flex items-center gap-2 px-3 py-2 bg-secondary/30 rounded-lg">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span className="text-foreground">{profile.phone}</span>
              </div>
            )}
          </div>

          {/* ID/Passport Number (GM-01) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                National ID Number
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="idNumber"
                  value={profile.idNumber}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              ) : (
                <div className="flex items-center gap-2 px-3 py-2 bg-secondary/30 rounded-lg">
                  <CreditCard className="w-4 h-4 text-muted-foreground" />
                  <span className="text-foreground">{profile.idNumber || "Not provided"}</span>
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Passport Number
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="passportNumber"
                  value={profile.passportNumber}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              ) : (
                <div className="flex items-center gap-2 px-3 py-2 bg-secondary/30 rounded-lg">
                  <CreditCard className="w-4 h-4 text-muted-foreground" />
                  <span className="text-foreground">{profile.passportNumber || "Not provided"}</span>
                </div>
              )}
            </div>
          </div>

          {/* Nationality & Date of Birth */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Nationality
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="nationality"
                  value={profile.nationality}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              ) : (
                <div className="px-3 py-2 bg-secondary/30 rounded-lg">
                  <span className="text-foreground">{profile.nationality}</span>
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Date of Birth
              </label>
              {isEditing ? (
                <input
                  type="date"
                  name="dateOfBirth"
                  value={profile.dateOfBirth}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              ) : (
                <div className="px-3 py-2 bg-secondary/30 rounded-lg">
                  <span className="text-foreground">
                    {new Date(profile.dateOfBirth).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Change Password Button */}
          <div>
            <button
              onClick={() => setShowPasswordModal(true)}
              className="flex items-center gap-2 text-sm text-primary hover:underline"
            >
              <Lock className="w-4 h-4" />
              Change Password
            </button>
          </div>
        </div>
      </div>

      {/* Preferences & Special Requests (GM-05) */}
      <div className="bg-card border border-border-light rounded-lg overflow-hidden">
        <div className="border-b border-border-light px-6 py-4">
          <h2 className="text-lg font-semibold text-foreground">Preferences & Special Requests</h2>
          <p className="text-sm text-muted-foreground">Let us know how to make your stay better</p>
        </div>
        <div className="p-6 space-y-5">
          {/* Room Preference */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Preferred Room Type
            </label>
            {isEditing ? (
              <select
                name="roomType"
                value={profile.preferences.roomType}
                onChange={(e) => setProfile({
                  ...profile,
                  preferences: { ...profile.preferences, roomType: e.target.value }
                })}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="Any">Any</option>
                <option value="Single">Single</option>
                <option value="Double">Double</option>
                <option value="Suite">Suite</option>
              </select>
            ) : (
              <div className="px-3 py-2 bg-secondary/30 rounded-lg">
                <span className="text-foreground">{profile.preferences.roomType}</span>
              </div>
            )}
          </div>

          {/* Checkbox Preferences */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground mb-2">
              Amenities Preferences
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="extraPillows"
                  checked={profile.preferences.extraPillows}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="accent-primary rounded"
                />
                <span className="text-sm text-foreground">Extra pillows</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="earlyCheckIn"
                  checked={profile.preferences.earlyCheckIn}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="accent-primary rounded"
                />
                <span className="text-sm text-foreground">Early check-in (subject to availability)</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="smoking"
                  checked={profile.preferences.smoking}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="accent-primary rounded"
                />
                <span className="text-sm text-foreground">Smoking room</span>
              </label>
            </div>
          </div>

          {/* Special Requests Text (GM-05) */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Special Requests
            </label>
            {isEditing ? (
              <textarea
                name="specialRequests"
                value={profile.specialRequests}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                placeholder="Any special requests or notes for your stay..."
              />
            ) : (
              <div className="px-3 py-2 bg-secondary/30 rounded-lg">
                <p className="text-foreground">{profile.specialRequests || "No special requests"}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card rounded-lg max-w-md w-full mx-4 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-foreground">Change Password</h3>
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setPasswordError("");
                  setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
                }}
                className="p-1 hover:bg-secondary rounded"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              {/* Current Password */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary pr-10"
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary pr-10"
                    placeholder="Enter new password (min 6 characters)"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Confirm new password"
                />
              </div>

              {/* Error Message */}
              {passwordError && (
                <div className="flex items-center gap-2 text-destructive text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {passwordError}
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setPasswordError("");
                  setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
                }}
                className="flex-1 px-4 py-2 border border-border rounded-lg text-foreground hover:bg-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handlePasswordChange}
                className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
              >
                Update Password
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GuestProfile;