# Ejemplos de Uso - CRUD Prize Distribution

## 🔧 Ejemplos Prácticos

### Ejemplo 1: Obtener y Mostrar Premios

```jsx
import { useState, useEffect } from 'react';
import { getPrizes } from '@/api';
import { PrizeTable, Loader } from '@/components';

export default function MyPrizeList() {
  const [prizes, setPrizes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getPrizes();
        setPrizes(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) return <Loader />;

  return (
    <PrizeTable
      prizes={prizes}
      onEdit={(id) => console.log('Editar', id)}
      onDelete={(id) => console.log('Eliminar', id)}
    />
  );
}
```

### Ejemplo 2: Formulario de Creación

```jsx
import { useState } from 'react';
import { createPrize } from '@/api';
import { PrizeForm } from '@/components';
import { useToast } from '@/hooks';

export default function CreatePrizeForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { showSuccess, showError } = useToast();

  const handleSubmit = async (formData) => {
    try {
      setIsLoading(true);
      await createPrize(formData);
      showSuccess('Premio creado exitosamente');
    } catch (error) {
      showError('Error al crear el premio');
    } finally {
      setIsLoading(false);
    }
  };

  return <PrizeForm onSubmit={handleSubmit} isLoading={isLoading} />;
}
```

### Ejemplo 3: Búsqueda y Filtrado

```jsx
import { useState, useEffect } from 'react';
import { getPrizes } from '@/api';

export default function SearchPrizes() {
  const [prizes, setPrizes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const delaySearch = setTimeout(async () => {
      if (searchTerm.length > 0) {
        const filtered = await getPrizes({
          league__name__icontains: searchTerm,
        });
        setPrizes(filtered);
      }
    }, 300);

    return () => clearTimeout(delaySearch);
  }, [searchTerm]);

  return (
    <div>
      <input
        type="text"
        placeholder="Buscar premios..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {/* mostrar resultados */}
    </div>
  );
}
```

### Ejemplo 4: Modal de Confirmación

```jsx
import { useState } from 'react';
import { deletePrize } from '@/api';
import { ConfirmModal } from '@/components';
import { useToast } from '@/hooks';

export default function DeletePrizeButton({ prizeId }) {
  const [showModal, setShowModal] = useState(false);
  const { showSuccess, showError } = useToast();

  const handleDelete = async () => {
    try {
      await deletePrize(prizeId);
      showSuccess('Premio eliminado');
      setShowModal(false);
    } catch (error) {
      showError('Error al eliminar');
    }
  };

  return (
    <>
      <button onClick={() => setShowModal(true)}>
        Eliminar
      </button>

      <ConfirmModal
        isOpen={showModal}
        title="Eliminar Premio"
        message="¿Estás seguro?"
        onConfirm={handleDelete}
        onCancel={() => setShowModal(false)}
        isDangerous={true}
      />
    </>
  );
}
```

### Ejemplo 5: Notificaciones Toast

```jsx
import { useToast } from '@/hooks';
import { Toast } from '@/components';

export default function ToastExample() {
  const { 
    toast, 
    showSuccess, 
    showError, 
    showInfo, 
    hideToast 
  } = useToast();

  return (
    <>
      <div>
        <button onClick={() => showSuccess('¡Éxito!')}>
          Éxito
        </button>
        <button onClick={() => showError('¡Error!')}>
          Error
        </button>
        <button onClick={() => showInfo('Información')}>
          Info
        </button>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={hideToast}
        />
      )}
    </>
  );
}
```

### Ejemplo 6: Obtener Ligas y Miembros

```jsx
import { useState, useEffect } from 'react';
import { getLeagues, getLeagueMembersByLeague } from '@/api';

export default function LeagueSelector() {
  const [leagues, setLeagues] = useState([]);
  const [members, setMembers] = useState([]);
  const [selectedLeague, setSelectedLeague] = useState('');

  useEffect(() => {
    const loadLeagues = async () => {
      const data = await getLeagues();
      setLeagues(data);
    };
    loadLeagues();
  }, []);

  const handleLeagueChange = async (leagueId) => {
    setSelectedLeague(leagueId);
    if (leagueId) {
      const data = await getLeagueMembersByLeague(leagueId);
      setMembers(data);
    }
  };

  return (
    <>
      <select 
        value={selectedLeague}
        onChange={(e) => handleLeagueChange(e.target.value)}
      >
        <option>Selecciona liga</option>
        {leagues.map(league => (
          <option key={league.id} value={league.id}>
            {league.name}
          </option>
        ))}
      </select>

      {selectedLeague && (
        <select>
          <option>Selecciona miembro</option>
          {members.map(member => (
            <option key={member.id} value={member.id}>
              {member.user?.username}
            </option>
          ))}
        </select>
      )}
    </>
  );
}
```

### Ejemplo 7: Validación en Formulario

```jsx
import { useState } from 'react';

export default function ValidatedForm() {
  const [formData, setFormData] = useState({
    amount: '',
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    if (!formData.amount) {
      newErrors.amount = 'El monto es requerido';
    } else if (parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'El monto debe ser mayor a 0';
    } else if (isNaN(formData.amount)) {
      newErrors.amount = 'Debe ser un número válido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      console.log('Formulario válido', formData);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input
          type="number"
          step="0.01"
          value={formData.amount}
          onChange={(e) => 
            setFormData({ ...formData, amount: e.target.value })
          }
          className={errors.amount ? 'is-invalid' : ''}
        />
        {errors.amount && (
          <span style={{ color: 'red' }}>
            {errors.amount}
          </span>
        )}
      </div>
      <button type="submit">Enviar</button>
    </form>
  );
}
```

### Ejemplo 8: Paginación (Futuro)

```jsx
import { useState, useEffect } from 'react';
import { getPrizes } from '@/api';

export default function PaginatedPrizes() {
  const [prizes, setPrizes] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const loadData = async () => {
      const params = {
        page,
        page_size: pageSize,
      };
      const response = await getPrizes(params);
      setPrizes(response.results);
      setTotalPages(Math.ceil(response.count / pageSize));
    };

    loadData();
  }, [page, pageSize]);

  return (
    <div>
      {/* Mostrar premios */}
      <div className="pagination">
        <button 
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          Anterior
        </button>
        <span>Página {page} de {totalPages}</span>
        <button 
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}
```

### Ejemplo 9: Exportar Datos

```jsx
import { getPrizes } from '@/api';

async function exportToCSV() {
  const prizes = await getPrizes();

  const csv = [
    ['Liga', 'Miembro', 'Posición', 'Monto', 'Tipo', 'Fecha'],
    ...prizes.map(p => [
      p.league_name,
      p.member_name,
      p.position,
      p.amount,
      p.type,
      new Date(p.created_at).toLocaleDateString(),
    ]),
  ];

  const content = csv
    .map(row => row.map(cell => `"${cell}"`).join(','))
    .join('\n');

  const blob = new Blob([content], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'premios.csv';
  a.click();
}

export default function ExportButton() {
  return (
    <button onClick={exportToCSV}>
      Exportar CSV
    </button>
  );
}
```

### Ejemplo 10: Refrescar Datos

```jsx
import { useState } from 'react';
import { getPrizes } from '@/api';

export default function PrizeList() {
  const [prizes, setPrizes] = useState([]);
  const [loading, setLoading] = useState(false);

  const refresh = async () => {
    try {
      setLoading(true);
      const data = await getPrizes();
      setPrizes(data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={refresh} disabled={loading}>
        {loading ? 'Refrescando...' : 'Refrescar'}
      </button>
      {/* Mostrar premios */}
    </div>
  );
}
```

## 📝 Notas Adicionales

- Todos los componentes ya están optimizados para performance
- Los hooks manejan automáticamente estados de carga
- Los errores se propagan correctamente
- Los datos se formatean automáticamente
- Las validaciones se realizan en cliente y servidor

## 🚀 Próximos Pasos

1. Implementar más casos de uso específicos
2. Agregar unit tests
3. Agregar e2e tests
4. Optimizar renderizado con React.memo
5. Agregar lazy loading
6. Implementar caching de datos
7. Agregar offline support
