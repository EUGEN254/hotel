import { useState } from "react";
import {
  User,
  Bell,
  Lock,
  Globe,
  Moon,
  Sun,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Shield,
  Save,
  Edit2,
  Eye,
  EyeOff,
  Check,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

const GuestSettings = () => {
  const { user, updateUser } = useAuth(); // Assuming you have an updateUser function
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState("");

  // Profile Form State
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "+1 234 567 8900",
    address: user?.address || "123 Hotel Street, Cityville",
    country: user?.country || "United States",
  });

  // Password Form State
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Notification Preferences
  const [notificationPrefs, setNotificationPrefs] = useState({
    emailNotifications: true,
    bookingReminders: true,
    promotionalEmails: false,
    smsAlerts: true,
    paymentUpdates: true,
  });

  // Appearance Preferences
  const [appearance, setAppearance] = useState({
    theme: "light", // light, dark, system
    compactView: false,
  });

  // Simulate save function
  const handleSaveProfile = async () => {
    setSaveError("");
    try {
      // await updateUser(profileData);
      setSaveSuccess(true);
      setIsEditing(false);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      setSaveError("Failed to update profile. Please try again.");
      setTimeout(() => setSaveError(""), 3000);
    }
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "security", label: "Security", icon: Lock },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "appearance", label: "Appearance", icon: Globe },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          Settings
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage your account preferences and settings
        </p>
      </div>

      {/* Success/Error Messages */}
      {saveSuccess && (
        <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center gap-2 text-green-700 dark:text-green-400">
          <Check className="w-4 h-4" />
          <span className="text-sm">Settings saved successfully!</span>
        </div>
      )}

      {saveError && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-2 text-red-700 dark:text-red-400">
          <AlertCircle className="w-4 h-4" />
          <span className="text-sm">{saveError}</span>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Tabs */}
        <div className="lg:w-64 flex-shrink-0">
          <div className="bg-card rounded-lg border border-border-light overflow-hidden">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 transition-all duration-200
                    ${
                      isActive
                        ? "bg-primary/10 text-primary border-r-2 border-primary"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Profile Settings */}
          {activeTab === "profile" && (
            <div className="bg-card rounded-lg border border-border-light p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-foreground">
                    Profile Information
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Update your personal information
                  </p>
                </div>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm text-primary hover:bg-primary/10 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit Profile
                  </button>
                )}
              </div>

              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) =>
                      setProfileData({ ...profileData, name: e.target.value })
                    }
                    disabled={!isEditing}
                    className="w-full px-3 py-2 bg-background border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-70 disabled:cursor-not-allowed"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) =>
                      setProfileData({ ...profileData, email: e.target.value })
                    }
                    disabled={!isEditing}
                    className="w-full px-3 py-2 bg-background border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-70 disabled:cursor-not-allowed"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) =>
                      setProfileData({ ...profileData, phone: e.target.value })
                    }
                    disabled={!isEditing}
                    className="w-full px-3 py-2 bg-background border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-70 disabled:cursor-not-allowed"
                  />
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    value={profileData.address}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        address: e.target.value,
                      })
                    }
                    disabled={!isEditing}
                    className="w-full px-3 py-2 bg-background border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-70 disabled:cursor-not-allowed"
                  />
                </div>

                {/* Country */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Country
                  </label>
                  <select
                    value={profileData.country}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        country: e.target.value,
                      })
                    }
                    disabled={!isEditing}
                    className="w-full px-3 py-2 bg-background border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    <option>United States</option>
                    <option>United Kingdom</option>
                    <option>Canada</option>
                    <option>Australia</option>
                    <option>Germany</option>
                    <option>France</option>
                  </select>
                </div>

                {/* Action Buttons */}
                {isEditing && (
                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={handleSaveProfile}
                      className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      <Save className="w-4 h-4" />
                      Save Changes
                    </button>
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setProfileData({
                          name: user?.name || "",
                          email: user?.email || "",
                          phone: user?.phone || "+1 234 567 8900",
                          address:
                            user?.address || "123 Hotel Street, Cityville",
                          country: user?.country || "United States",
                        });
                      }}
                      className="px-4 py-2 border border-border-light rounded-lg hover:bg-secondary transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Security Settings */}
          {activeTab === "security" && (
            <div className="bg-card rounded-lg border border-border-light p-4">
              {/* Two-Factor Authentication */}
              <div className=" pt-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">
                      Two-Factor Authentication
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <button className="px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors text-sm font-medium">
                    Enable 2FA
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Notification Settings */}
          {activeTab === "notifications" && (
            <div className="bg-card rounded-lg border border-border-light p-6">
              <h2 className="text-xl font-semibold text-foreground mb-6">
                Notification Preferences
              </h2>

              <div className="space-y-4">
                {[
                  {
                    id: "emailNotifications",
                    label: "Email Notifications",
                    description: "Receive email updates about your account",
                  },
                  {
                    id: "bookingReminders",
                    label: "Booking Reminders",
                    description: "Get reminders about upcoming bookings",
                  },
                  {
                    id: "promotionalEmails",
                    label: "Promotional Emails",
                    description: "Receive special offers and promotions",
                  },
                  {
                    id: "smsAlerts",
                    label: "SMS Alerts",
                    description:
                      "Get text message alerts for important updates",
                  },
                  {
                    id: "paymentUpdates",
                    label: "Payment Updates",
                    description:
                      "Receive notifications about payments and invoices",
                  },
                ].map((pref) => (
                  <div
                    key={pref.id}
                    className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-foreground">
                        {pref.label}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {pref.description}
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        setNotificationPrefs({
                          ...notificationPrefs,
                          [pref.id]: !notificationPrefs[pref.id],
                        })
                      }
                      className={`
                        relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                        ${
                          notificationPrefs[pref.id]
                            ? "bg-primary"
                            : "bg-border-light"
                        }
                      `}
                    >
                      <span
                        className={`
                          inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                          ${notificationPrefs[pref.id] ? "translate-x-6" : "translate-x-1"}
                        `}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Appearance Settings */}
          {activeTab === "appearance" && (
            <div className="bg-card rounded-lg border border-border-light p-6">
              <h2 className="text-xl font-semibold text-foreground mb-6">
                Appearance
              </h2>

              <div className="space-y-6">
                {/* Theme Selection */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-3">
                    Theme
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { id: "light", label: "Light", icon: Sun },
                      { id: "dark", label: "Dark", icon: Moon },
                      { id: "system", label: "System", icon: Globe },
                    ].map((theme) => {
                      const Icon = theme.icon;
                      const isActive = appearance.theme === theme.id;
                      return (
                        <button
                          key={theme.id}
                          onClick={() =>
                            setAppearance({ ...appearance, theme: theme.id })
                          }
                          className={`
                            flex items-center justify-center gap-2 p-3 rounded-lg border transition-all
                            ${
                              isActive
                                ? "border-primary bg-primary/10 text-primary"
                                : "border-border-light hover:border-primary/50"
                            }
                          `}
                        >
                          <Icon className="w-4 h-4" />
                          <span className="text-sm font-medium">
                            {theme.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Compact View Toggle */}
                <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">Compact View</p>
                    <p className="text-sm text-muted-foreground">
                      Reduce spacing and make content more dense
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      setAppearance({
                        ...appearance,
                        compactView: !appearance.compactView,
                      })
                    }
                    className={`
                      relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                      ${appearance.compactView ? "bg-primary" : "bg-border-light"}
                    `}
                  >
                    <span
                      className={`
                        inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                        ${appearance.compactView ? "translate-x-6" : "translate-x-1"}
                      `}
                    />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GuestSettings;
