import { Bell, KeyRound, Save, Shield, Sliders, User } from "lucide-react";
import { useState } from "react";
import { Badge, Button, Card, Col, Dropdown, Form, ListGroup, Nav, Row } from "react-bootstrap";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const formatTimezoneLabel = (tz: string) => {
    const staticLabels: Record<string, string> = {
        "America/New_York": "UTC -5:00 (America/New_York)",
        "America/Los_Angeles": "UTC -8:00 (America/Los_Angeles)",
        "Europe/London": "UTC +0:00 (Europe/London)",
        "Europe/Paris": "UTC +1:00 (Europe/Paris)",
        "Asia/Riyadh": "UTC +3:00 (Asia/Riyadh)",
        "Asia/Dubai": "UTC +4:00 (Asia/Dubai)",
        "Asia/Singapore": "UTC +8:00 (Asia/Singapore)",
        UTC: "UTC +0:00 (UTC)"
    };
    if (staticLabels[tz]) return staticLabels[tz];

    try {
        const offsetMinutes = new Date()
            .toLocaleString("en-US", { timeZone: tz, timeZoneName: "longOffset" })
            .split("GMT")[1];
        if (offsetMinutes) {
            const sign = offsetMinutes.startsWith("-") ? "-" : "+";
            const parts = offsetMinutes.substring(1).split(":");
            const hours = parseInt(parts[0], 10);
            const mins = parts[1];
            return `UTC ${sign}${hours}:${mins} (${tz})`;
        }
    } catch (e) {}
    return `UTC +0:00 (${tz})`;
};

const timezoneOptions = [
    "America/New_York",
    "America/Los_Angeles",
    "Europe/London",
    "Europe/Paris",
    "Asia/Riyadh",
    "Asia/Dubai",
    "Asia/Singapore",
    "UTC"
];

const SettingsPage = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState("profile");

    // Profile State
    const [name, setName] = useState(user?.name || "");
    const [email, setEmail] = useState(user?.email || "");
    const [countryCode, setCountryCode] = useState("+1");
    const [phone, setPhone] = useState("555-019-2834");
    const [timezone, setTimezone] = useState("Asia/Riyadh");
    const [bio, setBio] = useState("Academic account on ExamSys platform.");
    const [role] = useState(user?.role || "Student");

    // Notifications State
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [reminders, setReminders] = useState(true);
    const [weeklyDigest, setWeeklyDigest] = useState(false);
    const [pushNotifications, setPushNotifications] = useState(true);
    const [smsNotifications, setSmsNotifications] = useState(false);
    const [soundAlerts, setSoundAlerts] = useState(true);

    // Security State
    const [mfa, setMfa] = useState(false);

    // Appearance / Preferences State
    const [theme, setTheme] = useState("light");
    const [language, setLanguage] = useState("en");
    const [fontSize, setFontSize] = useState("medium");

    // Flag Lookup Data (Placed after state hook initializations)
    const countries = [
        { code: "+1", flag: "us", label: "US" },
        { code: "+44", flag: "gb", label: "UK" },
        { code: "+966", flag: "sa", label: "SA" },
        { code: "+962", flag: "jo", label: "JO" },
        { code: "+971", flag: "ae", label: "AE" }
    ];
    const activeCountry = countries.find((c) => c.code === countryCode) || countries[0];

    const languagesList = [
        { code: "en", flag: "us", name: "English (US)" },
        { code: "ar", flag: "sa", name: "العربية (Arabic)" },
        { code: "es", flag: "es", name: "Español (Spanish)" },
        { code: "fr", flag: "fr", name: "Français (French)" }
    ];
    const activeLanguage = languagesList.find((l) => l.code === language) || languagesList[0];

    const handleSaveProfile = (e: React.FormEvent) => {
        e.preventDefault();
        toast.success("Profile details saved successfully!");
    };

    const handleSaveNotifications = (e: React.FormEvent) => {
        e.preventDefault();
        toast.success("Notification preferences updated!");
    };

    const handleSaveSecurity = (e: React.FormEvent) => {
        e.preventDefault();
        toast.success("Security settings configured!");
    };

    const handleSavePreferences = (e: React.FormEvent) => {
        e.preventDefault();
        toast.success("Application preferences saved!");
    };

    const handleDetectTimezone = () => {
        try {
            const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
            setTimezone(tz);
            toast.success(`Detected timezone: ${tz}`);
        } catch (e) {
            toast.error("Failed to detect timezone automatically.");
        }
    };

    return (
        <div className="container-fluid py-2" style={{ maxWidth: "1000px" }}>
            <div className="mb-4">
                <h1 className="h3 fw-bold text-dark mb-1">Account Settings</h1>
                <p className="text-secondary">Manage your profile, preferences, alerts, and security settings</p>
            </div>

            <Row className="g-4">
                {/* Tab Controls (Left Sidebar Link Column) */}
                <Col xs={12} md={4} lg={3}>
                    <Card className="border-0 shadow-sm rounded-4 bg-white overflow-hidden p-2">
                        <Nav className="flex-column nav-pills gap-1">
                            <Nav.Link
                                active={activeTab === "profile"}
                                onClick={() => setActiveTab("profile")}
                                className="d-flex align-items-center gap-3 px-3 py-2.5 rounded-3 border-0 text-start w-100"
                                style={{
                                    backgroundColor:
                                        activeTab === "profile" ? "var(--color-primary-500)" : "transparent",
                                    color: activeTab === "profile" ? "#fff" : "var(--bs-secondary-color)",
                                    fontWeight: 500
                                }}
                            >
                                <User size={18} />
                                <span>Profile Details</span>
                            </Nav.Link>
                            <Nav.Link
                                active={activeTab === "notifications"}
                                onClick={() => setActiveTab("notifications")}
                                className="d-flex align-items-center gap-3 px-3 py-2.5 rounded-3 border-0 text-start w-100"
                                style={{
                                    backgroundColor:
                                        activeTab === "notifications" ? "var(--color-primary-500)" : "transparent",
                                    color: activeTab === "notifications" ? "#fff" : "var(--bs-secondary-color)",
                                    fontWeight: 500
                                }}
                            >
                                <Bell size={18} />
                                <span>Notifications</span>
                            </Nav.Link>
                            <Nav.Link
                                active={activeTab === "security"}
                                onClick={() => setActiveTab("security")}
                                className="d-flex align-items-center gap-3 px-3 py-2.5 rounded-3 border-0 text-start w-100"
                                style={{
                                    backgroundColor:
                                        activeTab === "security" ? "var(--color-primary-500)" : "transparent",
                                    color: activeTab === "security" ? "#fff" : "var(--bs-secondary-color)",
                                    fontWeight: 500
                                }}
                            >
                                <Shield size={18} />
                                <span>Security & 2FA</span>
                            </Nav.Link>
                            <Nav.Link
                                active={activeTab === "preferences"}
                                onClick={() => setActiveTab("preferences")}
                                className="d-flex align-items-center gap-3 px-3 py-2.5 rounded-3 border-0 text-start w-100"
                                style={{
                                    backgroundColor:
                                        activeTab === "preferences" ? "var(--color-primary-500)" : "transparent",
                                    color: activeTab === "preferences" ? "#fff" : "var(--bs-secondary-color)",
                                    fontWeight: 500
                                }}
                            >
                                <Sliders size={18} />
                                <span>Preferences</span>
                            </Nav.Link>
                        </Nav>
                    </Card>
                </Col>

                {/* Tab Content Column */}
                <Col xs={12} md={8} lg={9}>
                    <Card className="border-0 shadow-sm rounded-4 bg-white p-4">
                        {/* Tab 1: Profile Details */}
                        {activeTab === "profile" && (
                            <Form onSubmit={handleSaveProfile}>
                                <h4 className="fw-bold mb-4 text-dark d-flex align-items-center gap-2">
                                    <User size={20} className="text-primary" /> Profile Details
                                </h4>

                                <div className="d-flex align-items-center gap-3 mb-4 p-3 bg-light rounded-3">
                                    <img
                                        src={`https://ui-avatars.com/api/?name=${name || "User"}&background=10B981&color=fff&rounded=true`}
                                        alt="Avatar"
                                        className="rounded-circle border border-2 border-white shadow-sm"
                                        width="64"
                                        height="64"
                                    />
                                    <div>
                                        <div className="fw-bold text-dark">{name || "User"}</div>
                                        <div className="text-secondary small text-capitalize">
                                            {role.toLowerCase()} Account
                                        </div>
                                    </div>
                                </div>

                                <Row className="g-3">
                                    <Col xs={12} sm={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label className="fw-semibold text-secondary">Full Name</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                placeholder="Enter your full name"
                                                required
                                                className="rounded-3 border-light py-2"
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12} sm={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label className="fw-semibold text-secondary">
                                                Email Address
                                            </Form.Label>
                                            <Form.Control
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="Enter your email"
                                                required
                                                className="rounded-3 border-light py-2"
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12} sm={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label className="fw-semibold text-secondary">Phone Number</Form.Label>
                                            <div className="input-group">
                                                <Dropdown onSelect={(key) => setCountryCode(key || "+1")}>
                                                    <Dropdown.Toggle
                                                        variant="light"
                                                        className="border-light d-flex align-items-center gap-2"
                                                        style={{
                                                            borderTopLeftRadius: "8px",
                                                            borderBottomLeftRadius: "8px",
                                                            borderTopRightRadius: 0,
                                                            borderBottomRightRadius: 0
                                                        }}
                                                    >
                                                        <img
                                                            src={`https://flagcdn.com/16x12/${activeCountry.flag}.png`}
                                                            alt={activeCountry.label}
                                                            style={{
                                                                width: "16px",
                                                                height: "12px",
                                                                objectFit: "cover"
                                                            }}
                                                        />
                                                        <span>{activeCountry.code}</span>
                                                    </Dropdown.Toggle>

                                                    <Dropdown.Menu style={{ maxHeight: "250px", overflowY: "auto" }}>
                                                        {countries.map((c) => (
                                                            <Dropdown.Item
                                                                key={c.code}
                                                                eventKey={c.code}
                                                                className="d-flex align-items-center gap-2"
                                                            >
                                                                <img
                                                                    src={`https://flagcdn.com/16x12/${c.flag}.png`}
                                                                    alt={c.label}
                                                                    style={{
                                                                        width: "16px",
                                                                        height: "12px",
                                                                        objectFit: "cover"
                                                                    }}
                                                                />
                                                                <span>
                                                                    {c.label} ({c.code})
                                                                </span>
                                                            </Dropdown.Item>
                                                        ))}
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                                <Form.Control
                                                    type="text"
                                                    value={phone}
                                                    onChange={(e) => setPhone(e.target.value)}
                                                    placeholder="555-019-2834"
                                                    className="border-light py-2"
                                                    style={{
                                                        borderTopRightRadius: "8px",
                                                        borderBottomRightRadius: "8px"
                                                    }}
                                                />
                                            </div>
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12} sm={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label className="fw-semibold text-secondary d-flex justify-content-between align-items-center w-100">
                                                <span>Timezone</span>
                                                <Button
                                                    type="button"
                                                    variant="link"
                                                    className="p-0 text-decoration-none small fw-semibold"
                                                    onClick={handleDetectTimezone}
                                                    style={{ fontSize: "0.8rem" }}
                                                >
                                                    Detect Automatically
                                                </Button>
                                            </Form.Label>
                                            <Form.Select
                                                value={timezone}
                                                onChange={(e) => setTimezone(e.target.value)}
                                                className="rounded-3 border-light py-2"
                                            >
                                                {timezoneOptions.map((tz) => (
                                                    <option key={tz} value={tz}>
                                                        {formatTimezoneLabel(tz)}
                                                    </option>
                                                ))}
                                                {!timezoneOptions.includes(timezone) && (
                                                    <option value={timezone}>{formatTimezoneLabel(timezone)}</option>
                                                )}
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Form.Group className="mb-4">
                                    <Form.Label className="fw-semibold text-secondary">Account Bio</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        value={bio}
                                        onChange={(e) => setBio(e.target.value)}
                                        placeholder="Tell us about yourself"
                                        className="rounded-3 border-light py-2"
                                    />
                                </Form.Group>

                                <Button
                                    type="submit"
                                    className="d-flex align-items-center gap-2 rounded-3 px-4 py-2 border-0 bg-primary shadow-sm hover-bg-primary-dark"
                                >
                                    <Save size={16} /> Save Changes
                                </Button>
                            </Form>
                        )}

                        {/* Tab 2: Notifications */}
                        {activeTab === "notifications" && (
                            <Form onSubmit={handleSaveNotifications}>
                                <h4 className="fw-bold mb-4 text-dark d-flex align-items-center gap-2">
                                    <Bell size={20} className="text-primary" /> Notifications
                                </h4>

                                <div className="d-flex flex-column gap-3 mb-4">
                                    <div className="d-flex align-items-center justify-content-between p-3 border rounded-3 bg-light-subtle">
                                        <div>
                                            <div className="fw-semibold text-dark">Email Alerts</div>
                                            <div className="text-secondary small">
                                                Receive notifications of important changes via email.
                                            </div>
                                        </div>
                                        <Form.Check
                                            type="switch"
                                            id="email-alerts-switch"
                                            checked={emailNotifications}
                                            onChange={(e) => setEmailNotifications(e.target.checked)}
                                            className="custom-switch-large"
                                        />
                                    </div>

                                    <div className="d-flex align-items-center justify-content-between p-3 border rounded-3 bg-light-subtle">
                                        <div>
                                            <div className="fw-semibold text-dark">Browser Push Alerts</div>
                                            <div className="text-secondary small">
                                                Play sounds and display alerts inside the browser.
                                            </div>
                                        </div>
                                        <Form.Check
                                            type="switch"
                                            id="push-alerts-switch"
                                            checked={pushNotifications}
                                            onChange={(e) => setPushNotifications(e.target.checked)}
                                            className="custom-switch-large"
                                        />
                                    </div>

                                    <div className="d-flex align-items-center justify-content-between p-3 border rounded-3 bg-light-subtle">
                                        <div>
                                            <div className="fw-semibold text-dark">Exam Reminders</div>
                                            <div className="text-secondary small">
                                                Notify me 24 hours before any scheduled exam opens.
                                            </div>
                                        </div>
                                        <Form.Check
                                            type="switch"
                                            id="reminders-switch"
                                            checked={reminders}
                                            onChange={(e) => setReminders(e.target.checked)}
                                            className="custom-switch-large"
                                        />
                                    </div>

                                    <div className="d-flex align-items-center justify-content-between p-3 border rounded-3 bg-light-subtle">
                                        <div>
                                            <div className="fw-semibold text-dark">SMS Reminders</div>
                                            <div className="text-secondary small">
                                                Receive urgent low-timer or deadline alerts via text message.
                                            </div>
                                        </div>
                                        <Form.Check
                                            type="switch"
                                            id="sms-alerts-switch"
                                            checked={smsNotifications}
                                            onChange={(e) => setSmsNotifications(e.target.checked)}
                                            className="custom-switch-large"
                                        />
                                    </div>

                                    <div className="d-flex align-items-center justify-content-between p-3 border rounded-3 bg-light-subtle">
                                        <div>
                                            <div className="fw-semibold text-dark">Timer Sound Warnings</div>
                                            <div className="text-secondary small">
                                                Play a subtle tick sound during the final 5 minutes of exams.
                                            </div>
                                        </div>
                                        <Form.Check
                                            type="switch"
                                            id="sound-alerts-switch"
                                            checked={soundAlerts}
                                            onChange={(e) => setSoundAlerts(e.target.checked)}
                                            className="custom-switch-large"
                                        />
                                    </div>

                                    <div className="d-flex align-items-center justify-content-between p-3 border rounded-3 bg-light-subtle">
                                        <div>
                                            <div className="fw-semibold text-dark">Weekly Reports Digest</div>
                                            <div className="text-secondary small">
                                                Receive weekly progress summaries and statistics.
                                            </div>
                                        </div>
                                        <Form.Check
                                            type="switch"
                                            id="digest-switch"
                                            checked={weeklyDigest}
                                            onChange={(e) => setWeeklyDigest(e.target.checked)}
                                            className="custom-switch-large"
                                        />
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    className="d-flex align-items-center gap-2 rounded-3 px-4 py-2 border-0 bg-primary shadow-sm"
                                >
                                    <Save size={16} /> Save Preferences
                                </Button>
                            </Form>
                        )}

                        {/* Tab 3: Security */}
                        {activeTab === "security" && (
                            <Form onSubmit={handleSaveSecurity}>
                                <h4 className="fw-bold mb-4 text-dark d-flex align-items-center gap-2">
                                    <Shield size={20} className="text-primary" /> Security & 2FA
                                </h4>

                                <div className="mb-4 d-flex flex-column gap-3">
                                    <div className="d-flex align-items-center justify-content-between p-3 border rounded-3 bg-light-subtle">
                                        <div>
                                            <div className="fw-bold text-dark">Two-Factor Authentication (2FA)</div>
                                            <div className="text-secondary small">
                                                Protect your exam workspace with an additional device validation lock.
                                            </div>
                                        </div>
                                        <Form.Check
                                            type="switch"
                                            id="mfa-switch"
                                            checked={mfa}
                                            onChange={(e) => setMfa(e.target.checked)}
                                            className="custom-switch-large"
                                        />
                                    </div>

                                    <div className="p-3 border rounded-3 bg-light-subtle d-flex align-items-center justify-content-between">
                                        <div>
                                            <div className="fw-semibold text-dark">Update Password</div>
                                            <div className="text-secondary small">
                                                Keep your account secure by updating your secret key password regularly.
                                            </div>
                                        </div>
                                        <Link
                                            to="/change-password"
                                            className="btn btn-outline-secondary btn-sm rounded-2 px-3 py-1.5 fw-semibold d-flex align-items-center gap-1 text-decoration-none"
                                        >
                                            <KeyRound size={14} /> Change Password
                                        </Link>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <h6 className="fw-bold text-dark mb-2">Recent Login Activity</h6>
                                    <ListGroup className="rounded-3 border border-light overflow-hidden">
                                        <ListGroup.Item className="d-flex justify-content-between align-items-center p-3 small text-secondary bg-white">
                                            <div>
                                                <div className="fw-semibold text-dark">
                                                    Chrome on Windows (Boston, USA)
                                                </div>
                                                <div className="text-muted small">July 16, 2026 - 19:10 PM</div>
                                            </div>
                                            <Badge bg="success">Current Session</Badge>
                                        </ListGroup.Item>
                                        <ListGroup.Item className="d-flex justify-content-between align-items-center p-3 small text-secondary bg-white">
                                            <div>
                                                <div className="fw-semibold text-dark">
                                                    Safari on iPhone (New York, USA)
                                                </div>
                                                <div className="text-muted small">July 14, 2026 - 11:05 AM</div>
                                            </div>
                                            <Button
                                                variant="link"
                                                className="p-0 text-danger text-decoration-none small"
                                                onClick={() => toast.success("Session revoked.")}
                                            >
                                                Revoke
                                            </Button>
                                        </ListGroup.Item>
                                    </ListGroup>
                                    <div className="mt-3 text-end">
                                        <Button
                                            variant="outline-danger"
                                            size="sm"
                                            className="rounded-2 fw-semibold px-3"
                                            onClick={() => toast.success("All other active sessions revoked.")}
                                        >
                                            Terminate Other Sessions
                                        </Button>
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    className="d-flex align-items-center gap-2 rounded-3 px-4 py-2 border-0 bg-primary shadow-sm"
                                >
                                    <Save size={16} /> Save Security settings
                                </Button>
                            </Form>
                        )}

                        {/* Tab 4: Preferences / Appearance */}
                        {activeTab === "preferences" && (
                            <Form onSubmit={handleSavePreferences}>
                                <h4 className="fw-bold mb-4 text-dark d-flex align-items-center gap-2">
                                    <Sliders size={20} className="text-primary" /> Application Preferences
                                </h4>

                                <Row className="g-3 mb-4">
                                    <Col xs={12} sm={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label className="fw-semibold text-secondary">UI Theme</Form.Label>
                                            <Form.Select
                                                value={theme}
                                                onChange={(e) => setTheme(e.target.value)}
                                                className="rounded-3 border-light py-2"
                                            >
                                                <option value="light">Default Light Mode</option>
                                                <option value="dark">Premium Dark Mode</option>
                                                <option value="system">Auto System Theme</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12} sm={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label className="fw-semibold text-secondary">Language</Form.Label>
                                            <Dropdown onSelect={(key) => setLanguage(key || "en")} className="w-100">
                                                <Dropdown.Toggle
                                                    variant="white"
                                                    className="border-light rounded-3 py-2 text-start w-100 d-flex align-items-center justify-content-between"
                                                    style={{ border: "1px solid #dee2e6" }}
                                                >
                                                    <div className="d-flex align-items-center gap-2">
                                                        <img
                                                            src={`https://flagcdn.com/16x12/${activeLanguage.flag}.png`}
                                                            alt={activeLanguage.name}
                                                            style={{
                                                                width: "16px",
                                                                height: "12px",
                                                                objectFit: "cover"
                                                            }}
                                                        />
                                                        <span>{activeLanguage.name}</span>
                                                    </div>
                                                </Dropdown.Toggle>

                                                <Dropdown.Menu className="w-100">
                                                    {languagesList.map((l) => (
                                                        <Dropdown.Item
                                                            key={l.code}
                                                            eventKey={l.code}
                                                            className="d-flex align-items-center gap-2"
                                                        >
                                                            <img
                                                                src={`https://flagcdn.com/16x12/${l.flag}.png`}
                                                                alt={l.name}
                                                                style={{
                                                                    width: "16px",
                                                                    height: "12px",
                                                                    objectFit: "cover"
                                                                }}
                                                            />
                                                            <span>{l.name}</span>
                                                        </Dropdown.Item>
                                                    ))}
                                                </Dropdown.Menu>
                                            </Dropdown>
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12}>
                                        <Form.Group className="mb-3">
                                            <Form.Label className="fw-semibold text-secondary">
                                                Default Font Size
                                            </Form.Label>
                                            <div className="d-flex gap-3 mt-1">
                                                {["small", "medium", "large"].map((size) => (
                                                    <Form.Check
                                                        key={size}
                                                        type="radio"
                                                        id={`font-size-${size}`}
                                                        label={size.charAt(0).toUpperCase() + size.slice(1)}
                                                        name="fontSize"
                                                        checked={fontSize === size}
                                                        onChange={() => setFontSize(size)}
                                                        className="text-capitalize"
                                                    />
                                                ))}
                                            </div>
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Button
                                    type="submit"
                                    className="d-flex align-items-center gap-2 rounded-3 px-4 py-2 border-0 bg-primary shadow-sm"
                                >
                                    <Save size={16} /> Save Preferences
                                </Button>
                            </Form>
                        )}
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default SettingsPage;
