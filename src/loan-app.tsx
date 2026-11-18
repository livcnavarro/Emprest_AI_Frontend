import { useCallback, useEffect, useMemo, useState } from "react";
import type { Session } from "@supabase/supabase-js";

type EquipmentStatus = "Disponível" | "Emprestado" | "Em manutenção";
type CatalogFilter = "Todos" | EquipmentStatus;
type AppView = "catalog" | "loans";

interface Equipment {
  patrimony: string;
  name: string;
  category: string;
  status: EquipmentStatus;
  imageUrl: string;
  imageSourceUrl: string | null;
}

interface Loan {
  id: string;
  equipmentPatrimony: string;
  equipmentName: string;
  dueDate: string;
}

interface LoanCreated {
  id: string;
  createdAt: string;
  dueDate: string;
}

class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
  }
}

async function apiRequest<T>(
  session: Session,
  path: string,
  init?: RequestInit,
): Promise<T> {
  const headers = new Headers(init?.headers);
  headers.set("Authorization", `Bearer ${session.access_token}`);
  if (init?.body) {
    headers.set("Content-Type", "application/json");
  }

  let response: Response;
  try {
    response = await fetch(path, { ...init, headers });
  } catch (error) {
    throw new ApiError(
      error instanceof Error
        ? "Não foi possível conectar à API. Verifique se o Backend está disponível."
        : "Não foi possível conectar à API.",
      0,
    );
  }

  if (!response.ok) {
    let message = "A API não conseguiu concluir a solicitação.";
    try {
      const body: unknown = await response.json();
      if (
        typeof body === "object" &&
        body !== null &&
        "message" in body &&
        typeof body.message === "string"
      ) {
        message = body.message;
      }
    } catch {
      message = "A API retornou uma resposta inválida.";
    }
    throw new ApiError(message, response.status);
  }

  try {
    return (await response.json()) as T;
  } catch {
    throw new ApiError("A API retornou uma resposta inválida.", response.status);
  }
}

function formatDate(date: string): string {
  const day = date.slice(0, 10);
  return new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC" }).format(
    new Date(`${day}T00:00:00.000Z`),
  );
}

function statusClass(status: EquipmentStatus): string {
  if (status === "Disponível") return "pill pill-ok";
  if (status === "Em manutenção") return "pill pill-off";
  return "pill pill-loan";
}

interface LoanAppProps {
  session: Session;
  onSignOut: () => Promise<void>;
}

export function LoanApp({ session, onSignOut }: LoanAppProps) {
  const [view, setView] = useState<AppView>("catalog");
  const [filter, setFilter] = useState<CatalogFilter>("Todos");
  const [query, setQuery] = useState("");
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [requestingPatrimony, setRequestingPatrimony] = useState<string | null>(
    null,
  );
  const [signingOut, setSigningOut] = useState(false);

  const loadData = useCallback(async () => {
    return Promise.all([
      apiRequest<Equipment[]>(session, "/api/equipment"),
      apiRequest<Loan[]>(session, "/api/loans"),
    ]);
  }, [session]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    loadData()
      .then(([catalog, openLoans]) => {
        if (active) {
          setEquipment(catalog);
          setLoans(openLoans);
        }
      })
      .catch((cause: unknown) => {
        if (active) {
          setError(
            cause instanceof Error
              ? cause.message
              : "Não foi possível carregar o catálogo e os empréstimos.",
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [loadData]);

  const visibleEquipment = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("pt-BR");
    return equipment.filter((item) => {
      if (filter !== "Todos" && item.status !== filter) return false;
      if (!normalizedQuery) return true;
      return (
        item.name.toLocaleLowerCase("pt-BR").includes(normalizedQuery) ||
        item.patrimony.toLocaleLowerCase("pt-BR").includes(normalizedQuery)
      );
    });
  }, [equipment, filter, query]);

  async function requestLoan(item: Equipment): Promise<void> {
    setRequestingPatrimony(item.patrimony);
    setError(null);
    setNotice(null);

    try {
      const created = await apiRequest<LoanCreated>(session, "/api/loans", {
        method: "POST",
        body: JSON.stringify({ equipmentPatrimony: item.patrimony }),
      });
      setNotice(
        `Empréstimo criado. Devolução prevista para ${formatDate(created.dueDate)}.`,
      );
      setView("loans");
      setEquipment((catalog) =>
        catalog.map((entry) =>
          entry.patrimony === item.patrimony
            ? { ...entry, status: "Emprestado" }
            : entry,
        ),
      );
      try {
        const [catalog, openLoans] = await loadData();
        setEquipment(catalog);
        setLoans(openLoans);
      } catch {
        setError(
          "O empréstimo foi criado, mas não foi possível atualizar a lista. Recarregue a página.",
        );
      }
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Não foi possível solicitar este empréstimo.",
      );
    } finally {
      setRequestingPatrimony(null);
    }
  }

  async function signOut(): Promise<void> {
    setSigningOut(true);
    setError(null);
    try {
      await onSignOut();
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Não foi possível encerrar a sessão.",
      );
    } finally {
      setSigningOut(false);
    }
  }

  const availableCount = equipment.filter(
    (item) => item.status === "Disponível",
  ).length;
  const email = session.user.email ?? "Colaborador";

  return (
    <>
      <header className="nav">
        <div className="nav-brand">
          <div className="nav-mark"><span /></div>
          EMPREST<span className="dot">.AI</span>
        </div>
        <nav className="nav-tabs" aria-label="Navegação principal">
          <button
            className={`nav-tab${view === "catalog" ? " is-active" : ""}`}
            onClick={() => setView("catalog")}
            type="button"
          >
            Catálogo
          </button>
          <button
            className={`nav-tab${view === "loans" ? " is-active" : ""}`}
            onClick={() => setView("loans")}
            type="button"
          >
            Meus empréstimos
          </button>
        </nav>
        <div className="nav-end">
          <span className="tag tag-outline">Colaborador</span>
          <div className="avatar" aria-hidden="true">
            {email.slice(0, 2).toUpperCase()}
          </div>
          <span className="nav-name">{email}</span>
          <button
            className="nav-tab nav-signout"
            disabled={signingOut}
            onClick={() => void signOut()}
            type="button"
          >
            {signingOut ? "Saindo..." : "Sair"}
          </button>
        </div>
      </header>

      {error && <div className="app-feedback" role="alert">{error}</div>}
      {notice && <div className="app-notice" role="status">{notice}</div>}

      <main className="page">
        <div className="page-inner" data-view={view === "catalog" ? "catalogo" : "meus"}>
          {view === "catalog" ? (
            <section aria-labelledby="catalog-title">
              <div className="page-head">
                <h1 id="catalog-title">Catálogo</h1>
                <p className="lead">
                  {availableCount} de {equipment.length} equipamentos disponíveis agora
                </p>
                <input
                  className="input"
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Buscar por nome ou patrimônio"
                  type="search"
                  value={query}
                />
              </div>
              <div className="chips" aria-label="Filtrar equipamentos">
                {(["Todos", "Disponível", "Emprestado", "Em manutenção"] as const).map(
                  (name) => {
                    const labels: Record<CatalogFilter, string> = {
                      Todos: "Todos",
                      Disponível: "Disponíveis",
                      Emprestado: "Emprestados",
                      "Em manutenção": "Em manutenção",
                    };
                    return (
                    <button
                      className={`chip${filter === name ? " is-active" : ""}`}
                      key={name}
                      onClick={() => setFilter(name)}
                      type="button"
                    >
                      {labels[name]}
                    </button>
                    );
                  },
                )}
              </div>
              {loading ? (
                <div className="empty-state">Carregando catálogo...</div>
              ) : visibleEquipment.length === 0 ? (
                <div className="empty-state">
                  {equipment.length === 0
                    ? "O catálogo ainda não possui equipamentos cadastrados."
                    : "Nenhum equipamento nesta busca."}
                </div>
              ) : (
                <div className="grid">
                  {visibleEquipment.map((item) => (
                    <article className="card equipment-card" key={item.patrimony}>
                      <figure className="equipment-image">
                        {item.imageUrl ? (
                          <img
                            alt={item.name}
                            loading="lazy"
                            onError={(event) => {
                              event.currentTarget.hidden = true;
                              const fallback =
                                event.currentTarget.parentElement?.querySelector<HTMLElement>(
                                  ".image-unavailable",
                                );
                              if (fallback) fallback.hidden = false;
                            }}
                            src={item.imageUrl}
                          />
                        ) : null}
                        <span className="image-unavailable" hidden={Boolean(item.imageUrl)}>
                          Imagem ainda não disponível no Storage.
                        </span>
                        {item.imageSourceUrl && (
                          <figcaption>
                            <a
                              href={item.imageSourceUrl}
                              rel="noreferrer"
                              target="_blank"
                            >
                              Imagens via Pixabay
                            </a>
                          </figcaption>
                        )}
                      </figure>
                      <div className="card-top">
                        <div className="card-copy">
                          <div className="card-kicker">{item.category}</div>
                          <div className="card-title">{item.name}</div>
                          <div className="meta">{item.patrimony}</div>
                        </div>
                        <span className={statusClass(item.status)}>{item.status}</span>
                      </div>
                      <button
                        className="loan-request-button"
                        disabled={
                          item.status !== "Disponível" ||
                          requestingPatrimony !== null
                        }
                        onClick={() => void requestLoan(item)}
                        type="button"
                      >
                        {requestingPatrimony === item.patrimony
                          ? "Solicitando..."
                          : "Solicitar empréstimo"}
                      </button>
                    </article>
                  ))}
                </div>
              )}
            </section>
          ) : (
            <section aria-labelledby="loans-title">
              <div className="page-head">
                <h1 id="loans-title">Meus empréstimos</h1>
                <p className="lead">Seus empréstimos em aberto e as datas previstas.</p>
              </div>
              {loading ? (
                <div className="empty-state" role="status">Carregando empréstimos...</div>
              ) : loans.length === 0 ? (
                <div className="empty-state">Você não tem empréstimos em aberto.</div>
              ) : (
                <div className="loan-list">
                  {loans.map((loan) => (
                    <article className="loan" key={loan.id}>
                      <div className="loan-item">
                        {loan.equipmentName}
                        <div className="meta">{loan.equipmentPatrimony}</div>
                      </div>
                      <div className="loan-col">
                        <div className="k">Devolução prevista</div>
                        <div className="v">{formatDate(loan.dueDate)}</div>
                      </div>
                      <span className="pill pill-ok loan-pill">Em aberto</span>
                    </article>
                  ))}
                </div>
              )}
              <div className="rules">
                <span>Máximo de 3 itens</span>
                <span>Prazo de 14 dias corridos</span>
                <span>Atraso bloqueia novo empréstimo</span>
              </div>
            </section>
          )}
        </div>
      </main>
    </>
  );
}
