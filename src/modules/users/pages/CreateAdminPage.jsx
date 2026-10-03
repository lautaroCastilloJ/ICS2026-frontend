import CreateAdminForm from '../components/CreateAdminForm';
import Alert from '../../shared/ui/Alert';
import PageHeader from '../../shared/ui/PageHeader';

/** Alta de administradores: solo accesible para otro administrador. */
function CreateAdminPage() {
  return (
    <div className="max-w-2xl">
      <PageHeader
        title="Nuevo administrador"
        description="Da acceso completo al panel. Los clientes se registran solos desde la tienda."
      />
      <Alert tone="info" className="mb-8">
        Un administrador puede editar productos y cambiar el estado de cualquier pedido. Creá cuentas solo para personas de confianza.
      </Alert>
      <CreateAdminForm />
    </div>
  );
}

export default CreateAdminPage;
