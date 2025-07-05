import { Link } from "react-router-dom"

interface AboutProps {
  store: 'novabooks' | 'techshelf' | 'kidverse'
}

const About = ({ store }: AboutProps) => {
  const storeInfo = {
    novabooks: {
      title: "NovaBooks",
      description: "La nueva era de la lectura digital",
      longDescription: "NovaBooks representa la evolución de la lectura en el mundo digital. Nuestra plataforma combina diseño moderno con funcionalidad avanzada para ofrecer una experiencia de lectura excepcional.",
      features: [
        "Diseño moderno y elegante",
        "Colección premium de libros",
        "Navegación intuitiva",
        "Experiencia de usuario optimizada"
      ],
      color: "blue",
      gradient: "from-blue-500 to-indigo-600"
    },
    techshelf: {
      title: "TechShelf",
      description: "La biblioteca digital del futuro",
      longDescription: "TechShelf es la biblioteca digital más avanzada del mercado. Utilizamos tecnología de última generación para crear una experiencia de lectura revolucionaria.",
      features: [
        "Tecnología avanzada",
        "Navegación ultrarrápida",
        "Contenido multimedia",
        "Funcionalidades innovadoras"
      ],
      color: "green",
      gradient: "from-green-500 to-teal-600"
    },
    kidverse: {
      title: "KidVerse Reads",
      description: "Un mundo mágico de libros para niños",
      longDescription: "KidVerse Reads es el lugar perfecto para que los niños descubran el amor por la lectura. Nuestras historias despiertan la imaginación y fomentan el aprendizaje.",
      features: [
        "Libros infantiles especializados",
        "Contenido educativo",
        "Interfaz amigable para niños",
        "Historias que despiertan la imaginación"
      ],
      color: "orange",
      gradient: "from-orange-500 to-yellow-500"
    }
  }

  const info = storeInfo[store]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className={`text-5xl md:text-6xl font-bold bg-gradient-to-r ${info.gradient} bg-clip-text text-transparent mb-6`}>
            {info.title}
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
            {info.description}
          </p>
        </section>

        {/* About Section */}
        <section className="mb-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-gray-800">Sobre {info.title}</h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                {info.longDescription}
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                En {info.title}, creemos que cada lector merece una experiencia única y personalizada. 
                Nuestra misión es conectar a las personas con las historias que aman, utilizando la 
                tecnología más avanzada para crear una experiencia de lectura inolvidable.
              </p>
            </div>
            <div className={`bg-gradient-to-br ${info.gradient} rounded-2xl p-8 text-white`}>
              <h3 className="text-2xl font-bold mb-6">Características Principales</h3>
              <ul className="space-y-4">
                {info.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="mb-16">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className={`text-4xl font-bold text-${info.color}-600 mb-2`}>10,000+</div>
              <div className="text-gray-600">Libros Disponibles</div>
            </div>
            <div className="text-center">
              <div className={`text-4xl font-bold text-${info.color}-600 mb-2`}>50,000+</div>
              <div className="text-gray-600">Usuarios Activos</div>
            </div>
            <div className="text-center">
              <div className={`text-4xl font-bold text-${info.color}-600 mb-2`}>99.9%</div>
              <div className="text-gray-600">Tiempo de Actividad</div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">¿Listo para comenzar?</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Únete a nuestra comunidad de lectores y descubre un mundo de posibilidades literarias.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to={`/${store}/login`}
              className={`bg-${info.color}-600 hover:bg-${info.color}-700 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-200`}
            >
              Iniciar Sesión
            </Link>
            <Link 
              to={`/${store}/register`}
              className={`border-2 border-${info.color}-600 text-${info.color}-600 hover:bg-${info.color}-600 hover:text-white px-8 py-3 rounded-lg font-medium transition-colors duration-200`}
            >
              Registrarse
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}

export default About 