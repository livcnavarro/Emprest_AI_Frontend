import { useEffect, useState, type FormEvent } from "react";
import { createRoot } from "react-dom/client";
import {
  createClient,
  type Session,
  type SupabaseClient,
} from "@supabase/supabase-js";

import { LoanApp } from "./loan-app";
import "./style.css";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim() ?? "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() ?? "";

function isPublicSupabaseKey(key: string): boolean {
  if (key.startsWith("sb_secret_")) {
    return false;
  }
  if (key.startsWith("sb_publishable_")) {
    return true;
  }

  const payload = key.split(".")[1];
  if (!payload) {
    return false;
  }

  try {
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = atob(base64.padEnd(Math.ceil(base64.length / 4) * 4, "="));
    const claims: unknown = JSON.parse(decoded);
    return (
      typeof claims === "object" &&
      claims !== null &&
      "role" in claims &&
      claims.role === "anon"
    );
  } catch {
    return false;
  }
}

function createSupabaseClient(): {
  client: SupabaseClient | null;
  configurationError: string | null;
} {
  if (!supabaseUrl || !supabaseAnonKey) {
    return {
      client: null,
      configurationError:
        "O login ainda não está configurado. Preencha VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.",
    };
  }

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(supabaseUrl);
  } catch {
    return {
      client: null,
      configurationError: "A URL configurada para o Supabase é inválida.",
    };
  }

  const isLocalDevelopment =
    parsedUrl.protocol === "http:" && parsedUrl.hostname === "localhost";
  if (parsedUrl.protocol !== "https:" && !isLocalDevelopment) {
    return {
      client: null,
      configurationError:
        "A URL do Supabase deve usar HTTPS (ou localhost em desenvolvimento).",
    };
  }

  if (!isPublicSupabaseKey(supabaseAnonKey)) {
    return {
      client: null,
      configurationError:
        "Use somente a chave pública anon/publishable do Supabase. Chaves secret ou service_role não podem ser usadas no navegador.",
    };
  }

  return {
    client: createClient(supabaseUrl, supabaseAnonKey),
    configurationError: null,
  };
}

const { client: supabase, configurationError } = createSupabaseClient();

function Brand() {
  return (
    <div className="login-brand" aria-label="EMPREST.AI">
      <span className="nav-mark" aria-hidden="true">
        <span />
      </span>
      <span>
        EMPREST<span className="dot">.AI</span>
      </span>
    </div>
  );
}

interface LoginFormProps {
  busy: boolean;
  client: SupabaseClient | null;
  configurationError: string | null;
  initialError: string | null;
}

function LoginForm({
  busy,
  client,
  configurationError: configError,
  initialError,
}: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(initialError);

  useEffect(() => {
    setError(initialError);
  }, [initialError]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!client) {
      setError(configError ?? "O login não está disponível.");
      return;
    }

    setSubmitting(true);
    try {
      const { error: signInError } = await client.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (signInError) {
        setError("Não foi possível entrar. Verifique o e-mail e a senha.");
      }
    } catch {
      setError("Não foi possível conectar ao Supabase. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  }

  const isBusy = busy || submitting;

  return (
    <main className="login-layout" aria-busy={isBusy}>
      <section className="login-intro" aria-labelledby="welcome-title">
        <Brand />
        <div className="login-intro-copy">
          <h1 id="welcome-title">
            Equipamento certo.
            <br />
            Sem planilha.
          </h1>
          <p>
            Consulte o catálogo e acompanhe seus empréstimos de equipamentos
            internos em um só lugar.
          </p>
        </div>
        <div className="login-stats" aria-label="Regras do empréstimo">
          <div>
            <strong>3</strong>
            <span>itens por pessoa</span>
          </div>
          <div>
            <strong>14</strong>
            <span>dias corridos</span>
          </div>
          <div>
            <strong>0</strong>
            <span>linhas para preencher</span>
          </div>
        </div>
        <footer className="login-footer">Operações · TI interno</footer>
      </section>

      <section className="login-form-side" aria-labelledby="login-title">
        <div className="login-form">
          <h2 id="login-title">Entrar</h2>
          <p className="login-lead">Acesse com seu e-mail de trabalho.</p>

          {busy ? (
            <p className="login-status" role="status">
              Verificando sessão...
            </p>
          ) : (
            <form onSubmit={handleSubmit}>
              <label className="login-field">
                <span>E-mail</span>
                <input
                  autoComplete="username"
                  autoFocus
                  disabled={isBusy || !client}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  type="email"
                  value={email}
                />
              </label>

              <label className="login-field">
                <span>Senha</span>
                <input
                  autoComplete="current-password"
                  disabled={isBusy || !client}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  type="password"
                  value={password}
                />
              </label>

              {(error || configError) && (
                <p className="login-error" role="alert">
                  {error ?? configError}
                </p>
              )}

              <button
                className="login-submit"
                disabled={isBusy || !client}
                type="submit"
              >
                {isBusy ? "Entrando..." : "Entrar"}
              </button>
            </form>
          )}

          <button
            className="login-operations"
            disabled
            title="O acesso de Operações depende da definição de autorização por papel."
            type="button"
          >
            Entrar como Operações →
          </button>
          <p className="login-operations-hint">
            O acesso de Operações ainda não está configurado.
          </p>
          <p className="login-note">
            Cada pessoa vê apenas os próprios empréstimos.
          </p>
        </div>
      </section>
    </main>
  );
}

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [checkingSession, setCheckingSession] = useState(Boolean(supabase));
  const [sessionError, setSessionError] = useState<string | null>(null);

  useEffect(() => {
    if (!supabase) {
      setCheckingSession(false);
      return;
    }

    let active = true;
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setSessionError(null);
      setCheckingSession(false);
    });

    supabase.auth
      .getSession()
      .then(({ data, error }) => {
        if (!active) {
          return;
        }

        if (error) {
          setSessionError("Não foi possível verificar sua sessão.");
        } else {
          setSession(data.session);
        }
        setCheckingSession(false);
      })
      .catch(() => {
        if (active) {
          setSessionError("Não foi possível verificar sua sessão.");
          setCheckingSession(false);
        }
      });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  async function handleSignOut(): Promise<void> {
    if (!supabase) {
      return;
    }

    const { error } = await supabase.auth.signOut();
    if (error) {
      throw new Error("Não foi possível encerrar a sessão. Tente novamente.");
    }
  }

  if (session) {
    return <LoanApp session={session} onSignOut={handleSignOut} />;
  }

  return <LoginForm busy={checkingSession} client={supabase} configurationError={configurationError} initialError={sessionError} />;
}

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Elemento #root não encontrado.");
}

createRoot(rootElement).render(<App />);
