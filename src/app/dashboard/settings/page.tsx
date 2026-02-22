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
        <h2 className="text-xl font-bold">Configurações de Segurança</h2>
      </header>

      <div className="p-8 max-w-3xl mx-auto space-y-8">
        {/* Account Info */}
        <section className="glass-card rounded-2xl p-8 border border-white/5 space-y-6">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Icon name="person" className="text-primary" />
            Informações da Conta
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="Nome de Usuário" defaultValue="Summoner01" />
            <Input label="E-mail" type="email" defaultValue="summoner@email.com" />
          </div>
          <Button size="md" variant="outline">
            Atualizar Perfil
          </Button>
        </section>

        {/* Password */}
        <section className="glass-card rounded-2xl p-8 border border-white/5 space-y-6">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Icon name="lock" className="text-primary" />
            Alterar Senha
          </h3>
          <div className="space-y-4">
            <Input
              label="Senha Atual"
              type="password"
              placeholder="Digite a senha atual"
            />
            <Input
              label="Nova Senha"
              type="password"
              placeholder="Mín. 8 caracteres"
            />
            <Input
              label="Confirmar Nova Senha"
              type="password"
              placeholder="Confirme a nova senha"
            />
          </div>
          <Button size="md">Atualizar Senha</Button>
        </section>

        {/* Security Options */}
        <section className="glass-card rounded-2xl p-8 border border-white/5 space-y-6">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Icon name="shield" className="text-primary" />
            Opções de Segurança
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
              <div>
                <h4 className="font-bold text-sm">Autenticação em Dois Fatores</h4>
                <p className="text-xs text-white/50">
                  Adicione uma camada extra de segurança
                </p>
              </div>
              <Toggle checked={twoFa} onChange={setTwoFa} />
            </div>
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
              <div>
                <h4 className="font-bold text-sm">Alertas de Login</h4>
                <p className="text-xs text-white/50">
                  Receba notificações de novos acessos
                </p>
              </div>
              <Toggle checked={loginAlerts} onChange={setLoginAlerts} />
            </div>
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
              <div>
                <h4 className="font-bold text-sm">Notificações por E-mail</h4>
                <p className="text-xs text-white/50">
                  Atualizações de pedidos e promoções
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
            Sessões Ativas
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
              <div className="flex items-center gap-3">
                <Icon name="computer" className="text-primary" />
                <div>
                  <p className="text-sm font-bold">Chrome no macOS</p>
                  <p className="text-xs text-white/40">Sessão atual</p>
                </div>
              </div>
              <span className="text-xs text-green-400 font-bold">Ativo</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
              <div className="flex items-center gap-3">
                <Icon name="phone_iphone" className="text-white/40" />
                <div>
                  <p className="text-sm font-bold">Safari no iPhone</p>
                  <p className="text-xs text-white/40">2 dias atrás</p>
                </div>
              </div>
              <button className="text-xs text-red-400 font-bold hover:underline cursor-pointer">
                Revogar
              </button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
