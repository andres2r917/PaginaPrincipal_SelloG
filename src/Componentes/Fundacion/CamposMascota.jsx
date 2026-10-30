import { useRef, useState } from 'react'
import { FiAlertTriangle, FiCheck, FiShield, FiUploadCloud, FiX } from 'react-icons/fi'
import { DETALLE_ITEM, DETALLE_LABEL, ETIQUETAS, MODAL_GRID, etiqueta } from '../../Utils/adminEstilos'
import { FND_DROPZONE_HINT, FND_DROPZONE_ICONO, FND_DROPZONE_LINK, FND_DROPZONE_TEXTO, FND_MODAL_INPUT, FND_MODAL_SELECT, FND_PREVIEW_FOTO, FND_PREVIEW_FOTO_QUITAR, fndDropzone } from '../../Utils/fundacionEstilos'

// Campos de una mascota: los comparten "Registrar ingreso" y "Gestionar".
// form: { nombre, especie, raza, edadEstimada, tamano, sexo, temperamento, convivencia, estadoAdopcion,
//         estadoSalud, descripcion, fotoUrl, foto, vacunado, esterilizado, desparasitado }
// fotoUrl es la vista previa (o el enlace pegado) y foto es el archivo elegido, si lo hay.
const CamposMascota = ({ form, setForm }) => {
  const inputFotoRef = useRef(null)
  const [arrastrando, setArrastrando] = useState(false)
  const [modoUrl, setModoUrl] = useState(false)

  const cambiar = (campo) => (e) => setForm({ ...form, [campo]: e.target.value })
  const alternar = (campo) => () => setForm({ ...form, [campo]: !form[campo] })

  const elegirFoto = (archivo) => {
    if (archivo?.type.startsWith('image/')) {
      setForm({ ...form, foto: archivo, fotoUrl: URL.createObjectURL(archivo) })
    }
  }

  return (
    <>
      <div className={MODAL_GRID}>
        <div className={DETALLE_ITEM}>
          <span className={DETALLE_LABEL}>Nombre *</span>
          <input type="text" className={`${FND_MODAL_INPUT} mt-1 w-full`} value={form.nombre} onChange={cambiar('nombre')}
 required placeholder="Ej: Max, Luna" />
        </div>

        <div className={DETALLE_ITEM}>
          <span className={DETALLE_LABEL}>Especie</span>
          <select className={`${FND_MODAL_SELECT} mt-1 w-full`} value={form.especie} onChange={cambiar('especie')} >
            <option value="perro">Perro</option>
            <option value="gato">Gato</option>
            <option value="ave">Ave</option>
            <option value="otro">Otro</option>
          </select>
        </div>

        <div className={DETALLE_ITEM}>
          <span className={DETALLE_LABEL}>Raza *</span>
          <input type="text" className={`${FND_MODAL_INPUT} mt-1 w-full`} value={form.raza} onChange={cambiar('raza')}
 required placeholder="Ej: Criollo, Labrador" />
        </div>

        <div className={DETALLE_ITEM}>
          <span className={DETALLE_LABEL}>Edad estimada *</span>
          <input type="text" className={`${FND_MODAL_INPUT} mt-1 w-full`} value={form.edadEstimada} onChange={cambiar('edadEstimada')}
 required placeholder="Ej: 2 años, 8 meses" />
        </div>

        <div className={DETALLE_ITEM}>
          <span className={DETALLE_LABEL}>Tamaño</span>
          <select className={`${FND_MODAL_SELECT} mt-1 w-full`} value={form.tamano} onChange={cambiar('tamano')} >
            <option value="pequeño">Pequeño</option>
            <option value="mediano">Mediano</option>
            <option value="grande">Grande</option>
          </select>
        </div>

        <div className={DETALLE_ITEM}>
          <span className={DETALLE_LABEL}>Sexo</span>
          <select className={`${FND_MODAL_SELECT} mt-1 w-full`} value={form.sexo} onChange={cambiar('sexo')} >
            <option value="Macho">Macho</option>
            <option value="Hembra">Hembra</option>
          </select>
        </div>

        <div className={DETALLE_ITEM}>
          <span className={DETALLE_LABEL}>Estado de adopción</span>
          <select className={`${FND_MODAL_SELECT} mt-1 w-full`} value={form.estadoAdopcion} onChange={cambiar('estadoAdopcion')} >
            <option value="en_cuarentena">En cuarentena</option>
            <option value="disponible">Disponible</option>
            <option value="en_proceso">En proceso</option>
            <option value="adoptado">Adoptado</option>
          </select>
        </div>

        <div className={DETALLE_ITEM}>
          <span className={DETALLE_LABEL}>Temperamento</span>
          <input type="text" className={`${FND_MODAL_INPUT} mt-1 w-full`} value={form.temperamento} onChange={cambiar('temperamento')}
 placeholder="Ej: Juguetón, tranquilo, tímido" />
        </div>

        <div className={DETALLE_ITEM}>
          <span className={DETALLE_LABEL}>Convivencia</span>
          <input type="text" className={`${FND_MODAL_INPUT} mt-1 w-full`} value={form.convivencia} onChange={cambiar('convivencia')}
 placeholder="Ej: Apto con niños y otros perros" />
        </div>
      </div>

      {/* Foto: se sube desde el computador o se pega un enlace */}
      <div className="mt-4">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <span className={DETALLE_LABEL}>Foto de la mascota</span>
          <button type="button" onClick={() => setModoUrl(!modoUrl)}
            style={{ background: 'none', border: 'none', color: '#C4B5FD', fontSize: 12, cursor: 'pointer', textDecoration: 'underline' }}>
            {modoUrl ? 'Subir desde mi PC' : 'Pegar URL de imagen'}
          </button>
        </div>

        {modoUrl ? (
          <input type="url" className={FND_MODAL_INPUT} placeholder="https://ejemplo.com/foto.jpg"
            aria-label="Enlace de la foto" value={form.fotoUrl}
            onChange={(e) => setForm({ ...form, fotoUrl: e.target.value, foto: null })} style={{ width: '100%' }} />
        ) : form.fotoUrl ? (
          <div className={FND_PREVIEW_FOTO}>
            <img src={form.fotoUrl} alt="Vista previa" />
            <button type="button" className={FND_PREVIEW_FOTO_QUITAR} title="Quitar foto"
              onClick={() => setForm({ ...form, fotoUrl: '', foto: null })}>
              <FiX />
            </button>
          </div>
        ) : (
          <div
            className={fndDropzone(arrastrando)}
            onDragOver={(e) => { e.preventDefault(); setArrastrando(true) }}
            onDragLeave={() => setArrastrando(false)}
            onDrop={(e) => { e.preventDefault(); setArrastrando(false); elegirFoto(e.dataTransfer.files?.[0]) }}
            onClick={() => inputFotoRef.current?.click()}
          >
            <FiUploadCloud className={FND_DROPZONE_ICONO} />
            <p className={FND_DROPZONE_TEXTO}>
              <span className={FND_DROPZONE_LINK}>Sube una foto</span> desde tu computadora o arrástrala
            </p>
            <span className={FND_DROPZONE_HINT}>PNG, JPG o WEBP (máximo 4 MB)</span>
            <input ref={inputFotoRef} type="file" accept="image/*" className="hidden"
              onChange={(e) => elegirFoto(e.target.files?.[0])} />
          </div>
        )}
      </div>

      <div className="mt-3.5">
        <span className={DETALLE_LABEL}>Estado de salud *</span>
        <input type="text" className={`${FND_MODAL_INPUT} mt-1 w-full`} value={form.estadoSalud} onChange={cambiar('estadoSalud')}
 required placeholder="Ej: Saludable, esquema de vacunas completo..." />
      </div>

      <div className="mt-3.5">
        <span className={DETALLE_LABEL}>Etiquetas de salud (clic para alternar)</span>
        <div className={ETIQUETAS}>
          <button type="button" onClick={alternar('vacunado')}
            className={etiqueta(form.vacunado ? 'vacunado' : 'sinVacunas')}>
            {form.vacunado ? <><FiCheck /> Vacunado</> : <><FiAlertTriangle /> Sin Vacunas</>}
          </button>
          <button type="button" onClick={alternar('esterilizado')}
            className={etiqueta(form.esterilizado ? 'esterilizado' : 'sinEsterilizar')}>
            {form.esterilizado ? <><FiCheck /> Esterilizado</> : 'Sin Esterilizar'}
          </button>
          <button type="button" onClick={alternar('desparasitado')}
            className={etiqueta(form.desparasitado ? 'desparasitado' : 'sinDesparasitar')}>
            {form.desparasitado ? <><FiShield /> Desparasitado</> : <><FiAlertTriangle /> Sin desparasitar</>}
          </button>
        </div>
      </div>

      <div className="mt-3.5">
        <span className={DETALLE_LABEL}>Historia de la mascota *</span>
        <textarea className={`${FND_MODAL_INPUT} mt-1 w-full resize-y`} rows="3" value={form.descripcion} onChange={cambiar('descripcion')} required
 placeholder="Cuenta cómo llegó al refugio, su historia y cómo es su carácter. Es lo que leerán quienes quieran adoptarlo."
 />
      </div>
    </>
  )
}

export default CamposMascota
