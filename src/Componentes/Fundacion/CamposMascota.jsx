import { useRef, useState } from 'react'
import { FiAlertTriangle, FiCheck, FiShield, FiUploadCloud, FiX } from 'react-icons/fi'

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
      <div className="admin-modal__grid">
        <div className="admin-detail-item">
          <span className="admin-detail-label">Nombre *</span>
          <input type="text" className="fnd-modal__input campo-ancho" value={form.nombre} onChange={cambiar('nombre')}
 required placeholder="Ej: Max, Luna" />
        </div>

        <div className="admin-detail-item">
          <span className="admin-detail-label">Especie</span>
          <select className="fnd-modal__input campo-ancho" value={form.especie} onChange={cambiar('especie')} >
            <option value="perro">Perro</option>
            <option value="gato">Gato</option>
            <option value="ave">Ave</option>
            <option value="otro">Otro</option>
          </select>
        </div>

        <div className="admin-detail-item">
          <span className="admin-detail-label">Raza *</span>
          <input type="text" className="fnd-modal__input campo-ancho" value={form.raza} onChange={cambiar('raza')}
 required placeholder="Ej: Criollo, Labrador" />
        </div>

        <div className="admin-detail-item">
          <span className="admin-detail-label">Edad estimada *</span>
          <input type="text" className="fnd-modal__input campo-ancho" value={form.edadEstimada} onChange={cambiar('edadEstimada')}
 required placeholder="Ej: 2 años, 8 meses" />
        </div>

        <div className="admin-detail-item">
          <span className="admin-detail-label">Tamaño</span>
          <select className="fnd-modal__input campo-ancho" value={form.tamano} onChange={cambiar('tamano')} >
            <option value="pequeño">Pequeño</option>
            <option value="mediano">Mediano</option>
            <option value="grande">Grande</option>
          </select>
        </div>

        <div className="admin-detail-item">
          <span className="admin-detail-label">Sexo</span>
          <select className="fnd-modal__input campo-ancho" value={form.sexo} onChange={cambiar('sexo')} >
            <option value="Macho">Macho</option>
            <option value="Hembra">Hembra</option>
          </select>
        </div>

        <div className="admin-detail-item">
          <span className="admin-detail-label">Estado de adopción</span>
          <select className="fnd-modal__input campo-ancho" value={form.estadoAdopcion} onChange={cambiar('estadoAdopcion')} >
            <option value="en_cuarentena">En cuarentena</option>
            <option value="disponible">Disponible</option>
            <option value="en_proceso">En proceso</option>
            <option value="adoptado">Adoptado</option>
          </select>
        </div>

        <div className="admin-detail-item">
          <span className="admin-detail-label">Temperamento</span>
          <input type="text" className="fnd-modal__input campo-ancho" value={form.temperamento} onChange={cambiar('temperamento')}
 placeholder="Ej: Juguetón, tranquilo, tímido" />
        </div>

        <div className="admin-detail-item">
          <span className="admin-detail-label">Convivencia</span>
          <input type="text" className="fnd-modal__input campo-ancho" value={form.convivencia} onChange={cambiar('convivencia')}
 placeholder="Ej: Apto con niños y otros perros" />
        </div>
      </div>

      {/* Foto: se sube desde el computador o se pega un enlace */}
      <div className="mt-4">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <span className="admin-detail-label">Foto de la mascota</span>
          <button type="button" onClick={() => setModoUrl(!modoUrl)}
            style={{ background: 'none', border: 'none', color: '#C4B5FD', fontSize: 12, cursor: 'pointer', textDecoration: 'underline' }}>
            {modoUrl ? 'Subir desde mi PC' : 'Pegar URL de imagen'}
          </button>
        </div>

        {modoUrl ? (
          <input type="url" className="fnd-modal__input" placeholder="https://ejemplo.com/foto.jpg"
            aria-label="Enlace de la foto" value={form.fotoUrl}
            onChange={(e) => setForm({ ...form, fotoUrl: e.target.value, foto: null })} style={{ width: '100%' }} />
        ) : form.fotoUrl ? (
          <div className="fnd-preview-foto">
            <img src={form.fotoUrl} alt="Vista previa" />
            <button type="button" className="fnd-preview-foto__remover" title="Quitar foto"
              onClick={() => setForm({ ...form, fotoUrl: '', foto: null })}>
              <FiX />
            </button>
          </div>
        ) : (
          <div
            className={`fnd-dropzone ${arrastrando ? 'fnd-dropzone--drag' : ''}`}
            onDragOver={(e) => { e.preventDefault(); setArrastrando(true) }}
            onDragLeave={() => setArrastrando(false)}
            onDrop={(e) => { e.preventDefault(); setArrastrando(false); elegirFoto(e.dataTransfer.files?.[0]) }}
            onClick={() => inputFotoRef.current?.click()}
          >
            <FiUploadCloud className="fnd-dropzone__icon" />
            <p className="fnd-dropzone__texto">
              <span className="fnd-dropzone__link">Sube una foto</span> desde tu computadora o arrástrala
            </p>
            <span className="fnd-dropzone__hint">PNG, JPG o WEBP (máximo 4 MB)</span>
            <input ref={inputFotoRef} type="file" accept="image/*" className="oculto"
              onChange={(e) => elegirFoto(e.target.files?.[0])} />
          </div>
        )}
      </div>

      <div className="mt-3.5">
        <span className="admin-detail-label">Estado de salud *</span>
        <input type="text" className="fnd-modal__input campo-ancho" value={form.estadoSalud} onChange={cambiar('estadoSalud')}
 required placeholder="Ej: Saludable, esquema de vacunas completo..." />
      </div>

      <div className="mt-3.5">
        <span className="admin-detail-label">Etiquetas de salud (clic para alternar)</span>
        <div className="admin-tags-group">
          <button type="button" onClick={alternar('vacunado')}
            className={`admin-tag-toggle ${form.vacunado ? 'admin-tag-toggle--vacunado' : 'admin-tag-toggle--sin-vacunas'}`}>
            {form.vacunado ? <><FiCheck /> Vacunado</> : <><FiAlertTriangle /> Sin Vacunas</>}
          </button>
          <button type="button" onClick={alternar('esterilizado')}
            className={`admin-tag-toggle ${form.esterilizado ? 'admin-tag-toggle--esterilizado' : 'admin-tag-toggle--sin-esterilizar'}`}>
            {form.esterilizado ? <><FiCheck /> Esterilizado</> : 'Sin Esterilizar'}
          </button>
          <button type="button" onClick={alternar('desparasitado')}
            className={`admin-tag-toggle ${form.desparasitado ? 'admin-tag-toggle--desparasitado' : 'admin-tag-toggle--sin-desparasitar'}`}>
            {form.desparasitado ? <><FiShield /> Desparasitado</> : <><FiAlertTriangle /> Sin desparasitar</>}
          </button>
        </div>
      </div>

      <div className="mt-3.5">
        <span className="admin-detail-label">Historia de la mascota *</span>
        <textarea className="fnd-modal__input campo-ancho campo-redimensionable" rows="3" value={form.descripcion} onChange={cambiar('descripcion')} required
 placeholder="Cuenta cómo llegó al refugio, su historia y cómo es su carácter. Es lo que leerán quienes quieran adoptarlo."
 />
      </div>
    </>
  )
}

export default CamposMascota
