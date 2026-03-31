import { Helmet } from "react-helmet-async";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function LegalPage() {
  return (
    <>
      <Helmet><title>Legal | Partes Para Servidores</title></Helmet>
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <h1 className="text-3xl font-bold mb-6">Información legal</h1>
        <Tabs defaultValue="terms">
          <TabsList className="mb-6">
            <TabsTrigger value="terms">Términos</TabsTrigger>
            <TabsTrigger value="privacy">Datos personales</TabsTrigger>
            <TabsTrigger value="cookies">Cookies</TabsTrigger>
          </TabsList>
          <TabsContent value="terms" className="prose prose-sm max-w-none text-muted-foreground space-y-4">
            <h2 className="text-foreground font-bold">Términos y condiciones</h2>
            <p>Al utilizar el sitio web partesparaservidores.com.co, el usuario acepta los presentes términos y condiciones de uso. Los precios y disponibilidad de los productos están sujetos a confirmación por parte de nuestros asesores.</p>
            <p>Partes Para Servidores se reserva el derecho de modificar estos términos en cualquier momento sin previo aviso. Las cotizaciones generadas a través del sitio tienen validez de 15 días calendario.</p>
          </TabsContent>
          <TabsContent value="privacy" className="prose prose-sm max-w-none text-muted-foreground space-y-4">
            <h2 className="text-foreground font-bold">Política de tratamiento de datos personales</h2>
            <p>En cumplimiento con la Ley 1581 de 2012, informamos que los datos personales recopilados serán utilizados exclusivamente para atender solicitudes de cotización y brindar asesoría comercial.</p>
            <p>Los datos no serán compartidos con terceros sin autorización previa del titular. Para ejercer sus derechos de acceso, rectificación o supresión, contacte a mcalder@cableado-estructuraco.com.co.</p>
          </TabsContent>
          <TabsContent value="cookies" className="prose prose-sm max-w-none text-muted-foreground space-y-4">
            <h2 className="text-foreground font-bold">Política de cookies</h2>
            <p>Este sitio utiliza cookies para mejorar la experiencia del usuario. Las cookies utilizadas incluyen cookies de sesión y preferencias de navegación.</p>
            <p>Al continuar navegando, el usuario acepta el uso de cookies. Puede gestionar las preferencias de cookies desde la configuración de su navegador.</p>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
