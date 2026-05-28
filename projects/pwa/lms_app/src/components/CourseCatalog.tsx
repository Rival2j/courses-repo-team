import { useMemo, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { Search, X, Filter, Code, Palette, Briefcase, BarChart, Shield } from "lucide-react";
import ReactStars from "react-rating-stars-component";
import type { Course, ProgressState } from "../types";

const SORT_OPTIONS = [
  { value: "mostPopular", label: "Más populares" },
  { value: "bestRated", label: "Mejor calificados" },
  { value: "newest", label: "Más nuevos" },
  { value: "priceLowHigh", label: "Precio menor a mayor" },
  { value: "priceHighLow", label: "Precio mayor a menor" },
];

const RATING_OPTIONS = [4.5, 4.0, 3.5, 3.0];
const DURATION_OPTIONS = [
  { value: "all", label: "Todos" },
  { value: "short", label: "0-3 horas" },
  { value: "medium", label: "3-17 horas" },
  { value: "long", label: "17+ horas" },
];

const LEVEL_OPTIONS = ["Todos los niveles", "Principiante", "Intermedio", "Avanzado"] as const;
const LANGUAGE_OPTIONS = ["Español", "Inglés", "Portugués"] as const;
const CATEGORY_OPTIONS = [
  { label: "Desarrollo", icon: Code },
  { label: "Diseño", icon: Palette },
  { label: "Marketing", icon: Briefcase },
  { label: "Data Science", icon: BarChart },
  { label: "Seguridad", icon: Shield },
] as const;

const SEARCH_SUGGESTIONS = ["UX", "Seguridad", "Desarrollo", "Marketing", "Data Science"];

interface CourseCatalogProps {
  courses: Course[];
  progress: ProgressState["completedLessons"];
  enrolledCourses: string[];
}

interface Filters {
  rating: number;
  price: "all" | "free" | "paid";
  duration: "all" | "short" | "medium" | "long";
  level: typeof LEVEL_OPTIONS[number];
  language: typeof LANGUAGE_OPTIONS[number] | "Todos";
  categories: string[];
}

function countCourseProgress(course: Course, progress: ProgressState["completedLessons"]) {
  const allLessons = course.modules.flatMap((module) => module.lessons);
  const completed = allLessons.filter((lesson) => progress[lesson.id]).length;
  return {
    completed,
    total: allLessons.length,
    percentage: allLessons.length ? Math.round((completed / allLessons.length) * 100) : 0,
  };
}

function formatPrice(course: Course) {
  if (course.price === 0) {
    return <span className="course-price course-price-free">GRATIS</span>;
  }

  if (course.discountPercent && course.originalPrice) {
    return (
      <div className="course-price-group">
        <span className="course-price course-price-current">${course.price}</span>
        <span className="course-price course-price-original">${course.originalPrice}</span>
        <span className="course-price course-price-discount">-{course.discountPercent}%</span>
      </div>
    );
  }

  return <span className="course-price course-price-current">${course.price}</span>;
}

function applyFilters(courses: Course[], query: string, filters: Filters) {
  return courses.filter((course) => {
    const matchesQuery = query
      ? [course.title, course.summary, course.instructor, course.category].some((value) =>
          value.toLowerCase().includes(query.toLowerCase())
        )
      : true;

    const matchesRating = filters.rating ? course.rating >= filters.rating : true;
    const matchesLevel = filters.level === "Todos los niveles" ? true : course.level === filters.level;
    const matchesLanguage = filters.language === "Todos" ? true : course.language === filters.language;
    const matchesCategory = filters.categories.length === 0 ? true : filters.categories.includes(course.category);
    const matchesPrice =
      filters.price === "all"
        ? true
        : filters.price === "free"
        ? course.price === 0
        : course.price > 0;

    const duration = course.durationHours;
    const matchesDuration =
      filters.duration === "all"
        ? true
        : filters.duration === "short"
        ? duration <= 3
        : filters.duration === "medium"
        ? duration <= 17
        : duration > 17;

    return matchesQuery && matchesRating && matchesLevel && matchesLanguage && matchesCategory && matchesPrice && matchesDuration;
  });
}

function sortCourses(courses: Course[], sortBy: string) {
  return [...courses].sort((a, b) => {
    switch (sortBy) {
      case "bestRated":
        return b.rating - a.rating;
      case "newest":
        return (b.createdAt ?? 0) - (a.createdAt ?? 0);
      case "priceLowHigh":
        return a.price - b.price;
      case "priceHighLow":
        return b.price - a.price;
      case "mostPopular":
      default:
        return b.reviewCount - a.reviewCount;
    }
  });
}

function getActiveFilters(filters: Filters) {
  const chips: { label: string }[] = [];

  if (filters.price !== "all") {
    chips.push({ label: filters.price === "free" ? "Gratis" : "De pago" });
  }

  if (filters.rating) {
    chips.push({ label: `${filters.rating}+ ★` });
  }

  if (filters.duration !== "all") {
    chips.push({ label: DURATION_OPTIONS.find((option) => option.value === filters.duration)?.label ?? "Duración" });
  }

  if (filters.level !== "Todos los niveles") {
    chips.push({ label: filters.level });
  }

  if (filters.language !== "Todos") {
    chips.push({ label: filters.language });
  }

  filters.categories.forEach((category) => chips.push({ label: category }));

  return chips;
}

function CoursesSearchBar({
  value,
  onChange,
  onClear,
  onSelectSuggestion,
}: {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  onSelectSuggestion: (value: string) => void;
}) {
  return (
    <div className="search-bar">
      <label className="search-input-wrapper">
        <Search className="search-icon" />
        <input
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Buscar cursos, diseño, marketing..."
          className="search-input"
          aria-label="Buscar cursos"
        />
        {value ? (
          <button type="button" className="search-clear-button" onClick={onClear} aria-label="Borrar búsqueda">
            <X size={16} />
          </button>
        ) : null}
      </label>
      <div className="search-suggestions" aria-label="Sugerencias de búsqueda">
        {SEARCH_SUGGESTIONS.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            className="search-suggestion"
            onClick={() => onSelectSuggestion(suggestion)}
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
}

function Breadcrumb() {
  return (
    <nav aria-label="Breadcrumb" className="breadcrumb">
      <ol>
        <li>
          <Link to="/">Inicio</Link>
          <span aria-hidden="true">›</span>
        </li>
        <li aria-current="page">Cursos</li>
      </ol>
    </nav>
  );
}

function CoursesSortSelect({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <label className="sort-select">
      <span>Ordenar por</span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function ActiveFilterChips({ chips, onRemove }: { chips: { label: string; key: string }[]; onRemove: (label: string) => void }) {
  if (!chips.length) {
    return null;
  }

  return (
    <div className="filter-chips" aria-label="Filtros activos">
      {chips.map((chip) => (
        <button key={chip.key} type="button" className="filter-chip" onClick={() => onRemove(chip.label)}>
          {chip.label} <X size={12} />
        </button>
      ))}
    </div>
  );
}

function FilterSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="filter-section">
      <h4>{title}</h4>
      <div>{children}</div>
    </div>
  );
}

function CoursesFilterSidebar({ filters, onChange, onClearCategory }: { filters: Filters; onChange: (changes: Partial<Filters>) => void; onClearCategory: (category: string) => void }) {
  return (
    <aside className="filter-sidebar">
      <div className="sidebar-header">
        <h3>Filtros</h3>
      </div>
      <FilterSection title="Calificación">
        {RATING_OPTIONS.map((rating) => (
          <label key={rating} className="filter-option">
            <input
              type="radio"
              name="rating"
              checked={filters.rating === rating}
              onChange={() => onChange({ rating })}
            />
            {`${rating}+ ★`}
          </label>
        ))}
      </FilterSection>

      <FilterSection title="Precio">
        {[
          { label: "Todos", value: "all" },
          { label: "Gratuitos", value: "free" },
          { label: "De pago", value: "paid" },
        ].map((option) => (
          <label key={option.value} className="filter-option">
            <input
              type="radio"
              name="price"
              checked={filters.price === option.value}
              onChange={() => onChange({ price: option.value as Filters["price"] })}
            />
            {option.label}
          </label>
        ))}
      </FilterSection>

      <FilterSection title="Duración">
        {DURATION_OPTIONS.map((option) => (
          <label key={option.value} className="filter-option">
            <input
              type="radio"
              name="duration"
              checked={filters.duration === option.value}
              onChange={() => onChange({ duration: option.value as Filters["duration"] })}
            />
            {option.label}
          </label>
        ))}
      </FilterSection>

      <FilterSection title="Nivel">
        {LEVEL_OPTIONS.map((level) => (
          <label key={level} className="filter-option">
            <input
              type="radio"
              name="level"
              checked={filters.level === level}
              onChange={() => onChange({ level })}
            />
            {level}
          </label>
        ))}
      </FilterSection>

      <FilterSection title="Idioma">
        {LANGUAGE_OPTIONS.map((language) => (
          <label key={language} className="filter-option">
            <input
              type="radio"
              name="language"
              checked={filters.language === language}
              onChange={() => onChange({ language })}
            />
            {language}
          </label>
        ))}
        <label className="filter-option">
          <input
            type="radio"
            name="language"
            checked={filters.language === "Todos"}
            onChange={() => onChange({ language: "Todos" })}
          />
          Todos
        </label>
      </FilterSection>

      <FilterSection title="Categoría">
        <div className="category-grid">
          {CATEGORY_OPTIONS.map((item) => {
            const active = filters.categories.includes(item.label);
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                type="button"
                className={`category-button ${active ? "active" : ""}`}
                onClick={() => {
                  if (active) {
                    onClearCategory(item.label);
                  } else {
                    onChange({ categories: [...filters.categories, item.label] });
                  }
                }}
              >
                <Icon size={16} />
                {item.label}
              </button>
            );
          })}
        </div>
      </FilterSection>
    </aside>
  );
}

function CourseCardTooltip({ course }: { course: Course }) {
  return (
    <div className="course-tooltip" role="tooltip">
      <p>{course.summary}</p>
      <div className="course-tooltip-meta">
        <span>{course.level}</span>
        <span>{course.durationHours} horas</span>
      </div>
    </div>
  );
}

function CourseCard({ course, progress, enrolledCourses }: { course: Course; progress: ProgressState["completedLessons"]; enrolledCourses: string[] }) {
  const progressStats = countCourseProgress(course, progress);
  const isEnrolled = enrolledCourses.includes(course.id);

  return (
    <article className="course-card course-card-hover-group">
      <Link to={`/cursos/${course.id}`} className="course-card-link">
        <div className="course-card-hero">
          <img src={course.image} alt={course.title} className="course-image" />
          {course.badge ? <span className="course-badge">{course.badge}</span> : null}
        </div>
        <div className="course-card-body">
          <div className="course-card-header">
            <p className="course-category">{course.category}</p>
            <h3 className="course-title">{course.title}</h3>
          </div>
          <p className="course-subtitle">{course.summary}</p>
          <div className="course-card-meta-row">
            <div className="course-rating-wrapper">
              <ReactStars count={5} value={course.rating} size={18} edit={false} isHalf activeColor="#f59e0b" />
              <span className="course-rating-value">{course.rating.toFixed(1)}</span>
            </div>
            <span className="course-review-count">({course.reviewCount})</span>
          </div>
          <div className="course-card-meta-row course-meta-list">
            <span>{course.instructor}</span>
            <span>{course.difficulty}</span>
            <span>{course.durationHours} horas</span>
          </div>
          {formatPrice(course)}
          <div className="course-progress-mini">
            <span>{progressStats.percentage}% completado</span>
            <progress value={progressStats.percentage} max={100} />
          </div>
        </div>
      </Link>
      <CourseCardTooltip course={course} />
    </article>
  );
}

function CoursesGrid({ courses, progress, enrolledCourses }: { courses: Course[]; progress: ProgressState["completedLessons"]; enrolledCourses: string[] }) {
  return (
    <div className="courses-grid" role="list">
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} progress={progress} enrolledCourses={enrolledCourses} />
      ))}
    </div>
  );
}

function EmptyState({ query, filtersActive }: { query: string; filtersActive: boolean }) {
  return (
    <div className="empty-state">
      <div className="empty-state-illustration" aria-hidden="true">📚</div>
      <h3>No encontramos cursos con esos filtros</h3>
      <p>
        Ajusta el término de búsqueda o modifica los filtros. Si quieres, borra los filtros activos y vuelve a probar.
      </p>
      {filtersActive ? <p className="empty-state-tip">Consejo: prueba con "UX", "Seguridad" o "Marketing".</p> : null}
    </div>
  );
}

function Pagination({ page, totalPages, onNavigate }: { page: number; totalPages: number; onNavigate: (newPage: number) => void }) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav className="pagination" aria-label="Paginación de cursos">
      <button type="button" className="pagination-item" disabled={page === 1} onClick={() => onNavigate(page - 1)}>
        Anterior
      </button>
      {Array.from({ length: totalPages }, (_, index) => (
        <button
          key={index}
          type="button"
          className={`pagination-item ${page === index + 1 ? "active" : ""}`}
          onClick={() => onNavigate(index + 1)}
        >
          {index + 1}
        </button>
      ))}
      <button type="button" className="pagination-item" disabled={page === totalPages} onClick={() => onNavigate(page + 1)}>
        Siguiente
      </button>
    </nav>
  );
}

export function CoursesCatalog({ courses, progress, enrolledCourses }: CourseCatalogProps) {
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("mostPopular");
  const [filters, setFilters] = useState<Filters>({
    rating: 0,
    price: "all",
    duration: "all",
    level: "Todos los niveles",
    language: "Todos",
    categories: [],
  });
  const [page, setPage] = useState(1);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const filteredCourses = useMemo(() => applyFilters(courses, query, filters), [courses, filters, query]);
  const sortedCourses = useMemo(() => sortCourses(filteredCourses, sortBy), [filteredCourses, sortBy]);
  const itemsPerPage = 8;
  const totalPages = Math.max(1, Math.ceil(sortedCourses.length / itemsPerPage));
  const currentCourses = sortedCourses.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const activeChips = useMemo(() => {
    const filterItems = getActiveFilters(filters);
    return filterItems.map((item) => ({ ...item, key: item.label }));
  }, [filters]);

  const clearFilter = (label: string) => {
    if (label === "Gratis" || label === "De pago") {
      setFilters((prev) => ({ ...prev, price: "all" }));
    }
    if (label.endsWith("+ ★")) {
      setFilters((prev) => ({ ...prev, rating: 0 }));
    }
    if (label === "0-3 horas" || label === "3-17 horas" || label === "17+ horas") {
      setFilters((prev) => ({ ...prev, duration: "all" }));
    }
    if (LEVEL_OPTIONS.includes(label as typeof LEVEL_OPTIONS[number])) {
      setFilters((prev) => ({ ...prev, level: "Todos los niveles" }));
    }
    if (LANGUAGE_OPTIONS.includes(label as typeof LANGUAGE_OPTIONS[number])) {
      setFilters((prev) => ({ ...prev, language: "Todos" }));
    }
    if (filters.categories.includes(label)) {
      setFilters((prev) => ({ ...prev, categories: prev.categories.filter((category) => category !== label) }));
    }
  };

  const resetPaging = () => setPage(1);

  return (
    <section aria-labelledby="courses-heading" className="page-content courses-page">
      <div className="page-header page-header-stack">
        <div>
          <Breadcrumb />
          <h2 id="courses-heading">Catálogo de cursos</h2>
          <p className="page-description">Encuentra cursos de desarrollo, diseño, marketing y seguridad con filtros tipo Udemy.</p>
        </div>
        <div className="mobile-filter-button-wrapper">
          <button type="button" className="button button-secondary mobile-filter-button" onClick={() => setDrawerOpen(true)}>
            <Filter size={16} /> Filtros
            {activeChips.length ? ` (${activeChips.length})` : ""}
          </button>
        </div>
      </div>

      <CoursesSearchBar
        value={query}
        onChange={(value) => {
          setQuery(value);
          resetPaging();
        }}
        onClear={() => {
          setQuery("");
          resetPaging();
        }}
        onSelectSuggestion={(value) => {
          setQuery(value);
          resetPaging();
        }}
      />

      <CoursesResultsHeader total={filteredCourses.length} onSortChange={(value) => setSortBy(value)} sortBy={sortBy} />

      <ActiveFilterChips chips={activeChips} onRemove={clearFilter} />

      <div className="courses-layout">
        <CoursesFilterSidebar
          filters={filters}
          onChange={(changes) => {
            setFilters((prev) => ({ ...prev, ...changes }));
            resetPaging();
          }}
          onClearCategory={(category) => {
            setFilters((prev) => ({ ...prev, categories: prev.categories.filter((item) => item !== category) }));
            resetPaging();
          }}
        />
        <div className="courses-main">
          {currentCourses.length > 0 ? (
            <>
              <CoursesGrid courses={currentCourses} progress={progress} enrolledCourses={enrolledCourses} />
              <Pagination page={page} totalPages={totalPages} onNavigate={(newPage) => setPage(newPage)} />
            </>
          ) : (
            <EmptyState query={query} filtersActive={activeChips.length > 0} />
          )}
        </div>
      </div>

      {drawerOpen ? (
        <div className="drawer-backdrop" role="dialog" aria-modal="true">
          <div className="drawer-panel">
            <div className="drawer-header">
              <h3>Filtros</h3>
              <button type="button" className="icon-button" onClick={() => setDrawerOpen(false)} aria-label="Cerrar filtros">
                <X size={18} />
              </button>
            </div>
            <CoursesFilterSidebar
              filters={filters}
              onChange={(changes) => {
                setFilters((prev) => ({ ...prev, ...changes }));
                resetPaging();
              }}
              onClearCategory={(category) => {
                setFilters((prev) => ({ ...prev, categories: prev.categories.filter((item) => item !== category) }));
                resetPaging();
              }}
            />
            <button type="button" className="button button-secondary drawer-close-button" onClick={() => setDrawerOpen(false)}>
              Cerrar filtros
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}

function CoursesResultsHeader({ total, onSortChange, sortBy }: { total: number; onSortChange: (value: string) => void; sortBy: string }) {
  return (
    <div className="results-header">
      <div>
        <p className="results-count">{total} cursos encontrados</p>
      </div>
      <CoursesSortSelect value={sortBy} onChange={onSortChange} />
    </div>
  );
}
