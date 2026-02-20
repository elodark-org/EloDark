"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { Toggle } from "@/components/ui/toggle";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  const [twoFa, setTwoFa] = useState(false);
  const [loginAlerts, setLoginAlerts] = useState(true);
  const [emailNotifs, setEmailNotifs] = useState(true);

  return (
    <>
      <header className="sticky top-0 z-30 flex items-center px-8 py-4 bg-bg-primary/60 backdrop-blur-md border-b border-white/5">
        <h2 className="text-xl font-bold">Security Settings</h2>
      </header>

      <div className="p-8 max-w-3xl mx-auto space-y-8">
        {/* Account Info */}
        <section className="glass-card rounded-2xl p-8 border border-white/5 space-y-6">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Icon name="person" className="text-primary" />
            Account Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="Username" defaultValue="Summoner01" />
            <Input label="Email" type="email" defaultValue="summoner@email.com" />
          </div>
          <Button size="md" variant="outline">
            Update Profile
          </Button>
        </section>

        {/* Password */}
        <section className="glass-card rounded-2xl p-8 border border-white/5 space-y-6">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Icon name="lock" className="text-primary" />
            Change Password
          </h3>
          <div className="space-y-4">
            <Input
              label="Current Password"
              type="password"
              placeholder="Enter current password"
            />
            <Input
              label="New Password"
              type="password"
              placeholder="Min. 8 characters"
            />
            <Input
              label="Confirm New Password"
              type="password"
              placeholder="Confirm new password"
            />
          </div>
          <Button size="md">Update Password</Button>
        </section>

        {/* Security Options */}
        <section className="glass-card rounded-2xl p-8 border border-white/5 space-y-6">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Icon name="shield" className="text-primary" />
            Security Options
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
              <div>
                <h4 className="font-bold text-sm">Two-Factor Authentication</h4>
                <p className="text-xs text-white/50">
                  Add an extra layer of security
                </p>
              </div>
              <Toggle checked={twoFa} onChange={setTwoFa} />
            </div>
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
              <div>
                <h4 className="font-bold text-sm">Login Alerts</h4>
                <p className="text-xs text-white/50">
                  Get notified of new sign-ins
                </p>
              </div>
              <Toggle checked={loginAlerts} onChange={setLoginAlerts} />
            </div>
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
              <div>
                <h4 className="font-bold text-sm">Email Notifications</h4>
                <p className="text-xs text-white/50">
                  Order updates and promotions
                </p>
              </div>
              <Toggle checked={emailNotifs} onChange={setEmailNotifs} />
            </div>
          </div>
        </section>

        {/* Active Sessions */}
        <section className="glass-card rounded-2xl p-8 border border-white/5 space-y-6">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Icon name="devices" className="text-primary" />
            Active Sessions
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
              <div className="flex items-center gap-3">
                <Icon name="computer" className="text-primary" />
                <div>
                  <p className="text-sm font-bold">Chrome on macOS</p>
                  <p className="text-xs text-white/40">Current session</p>
                </div>
              </div>
              <span className="text-xs text-green-400 font-bold">Active</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
              <div className="flex items-center gap-3">
                <Icon name="phone_iphone" className="text-white/40" />
                <div>
                  <p className="text-sm font-bold">Safari on iPhone</p>
                  <p className="text-xs text-white/40">2 days ago</p>
                </div>
              </div>
              <button className="text-xs text-red-400 font-bold hover:underline cursor-pointer">
                Revoke
              </button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
