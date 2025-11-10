import { useState, useEffect } from 'react';
import './Admin.css';

function Admin() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const response = await fetch('/api/config');
      const data = await response.json();
      setConfig(data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading config:', error);
      setMessage('Error loading configuration');
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/verify-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        setIsAuthenticated(true);
        setMessage('');
      } else {
        setMessage('Invalid password');
      }
    } catch (error) {
      setMessage('Authentication error');
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');

    try {
      const response = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, config }),
      });

      if (response.ok) {
        setMessage('Configuration saved successfully! Refresh the main page to see changes.');
      } else {
        setMessage('Failed to save configuration');
      }
    } catch (error) {
      setMessage('Error saving configuration');
    } finally {
      setSaving(false);
    }
  };

  const updateConfig = (path, value) => {
    const newConfig = { ...config };
    const keys = path.split('.');
    let current = newConfig;

    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }

    current[keys[keys.length - 1]] = value;
    setConfig(newConfig);
  };

  const updateProject = (categoryIndex, projectIndex, field, value) => {
    const newConfig = { ...config };
    newConfig.projects.categories[categoryIndex].projects[projectIndex][field] = value;
    setConfig(newConfig);
  };

  const updateProjectHighlight = (categoryIndex, projectIndex, highlightIndex, value) => {
    const newConfig = { ...config };
    newConfig.projects.categories[categoryIndex].projects[projectIndex].highlights[highlightIndex] = value;
    setConfig(newConfig);
  };

  const addProject = (categoryIndex) => {
    const newConfig = { ...config };
    newConfig.projects.categories[categoryIndex].projects.push({
      name: 'New Project',
      description: 'Description',
      technologies: [],
      githubUrl: '',
      liveUrl: '',
      docsUrl: '',
      highlights: []
    });
    setConfig(newConfig);
  };

  const deleteProject = (categoryIndex, projectIndex) => {
    if (confirm('Are you sure you want to delete this project?')) {
      const newConfig = { ...config };
      newConfig.projects.categories[categoryIndex].projects.splice(projectIndex, 1);
      setConfig(newConfig);
    }
  };

  if (loading) {
    return <div className="admin-loading">Loading admin panel...</div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="admin-login">
        <div className="login-card">
          <h1>Admin Access</h1>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="password-input"
            />
            <button type="submit" className="btn-login">Login</button>
          </form>
          {message && <p className="message error">{message}</p>}
        </div>
      </div>
    );
  }

  if (!config) {
    return <div className="admin-error">Error loading configuration</div>;
  }

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h1>Admin Panel</h1>
        <div className="admin-actions">
          <button onClick={handleSave} disabled={saving} className="btn-save">
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          <a href="/" className="btn-back">Back to Site</a>
        </div>
      </div>

      {message && <div className="message success">{message}</div>}

      <div className="admin-content">
        {/* Personal Information */}
        <section className="admin-section">
          <h2>Personal Information</h2>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              value={config.personal.name}
              onChange={(e) => updateConfig('personal.name', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              value={config.personal.title}
              onChange={(e) => updateConfig('personal.title', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Photo URL</label>
            <input
              type="text"
              value={config.personal.photo}
              onChange={(e) => updateConfig('personal.photo', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={config.personal.email}
              onChange={(e) => updateConfig('personal.email', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>LinkedIn URL</label>
            <input
              type="url"
              value={config.personal.linkedin}
              onChange={(e) => updateConfig('personal.linkedin', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>GitHub URL</label>
            <input
              type="url"
              value={config.personal.github}
              onChange={(e) => updateConfig('personal.github', e.target.value)}
            />
          </div>
        </section>

        {/* About Section */}
        <section className="admin-section">
          <h2>About Section</h2>
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              value={config.about.title}
              onChange={(e) => updateConfig('about.title', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              rows="6"
              value={config.about.description}
              onChange={(e) => updateConfig('about.description', e.target.value)}
            />
          </div>
        </section>

        {/* Projects */}
        <section className="admin-section">
          <h2>Projects</h2>
          {config.projects.categories.map((category, catIndex) => (
            <div key={catIndex} className="category-section">
              <h3>{category.name}</h3>
              <div className="form-group">
                <label>Category Description</label>
                <input
                  type="text"
                  value={category.description}
                  onChange={(e) => {
                    const newConfig = { ...config };
                    newConfig.projects.categories[catIndex].description = e.target.value;
                    setConfig(newConfig);
                  }}
                />
              </div>

              <div className="projects-list">
                {category.projects.map((project, projIndex) => (
                  <div key={projIndex} className="project-card-admin">
                    <div className="project-header-admin">
                      <h4>Project {projIndex + 1}</h4>
                      <button
                        onClick={() => deleteProject(catIndex, projIndex)}
                        className="btn-delete"
                      >
                        Delete
                      </button>
                    </div>

                    <div className="form-group">
                      <label>Project Name</label>
                      <input
                        type="text"
                        value={project.name}
                        onChange={(e) => updateProject(catIndex, projIndex, 'name', e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label>Description</label>
                      <textarea
                        rows="3"
                        value={project.description}
                        onChange={(e) => updateProject(catIndex, projIndex, 'description', e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label>Technologies (comma-separated)</label>
                      <input
                        type="text"
                        value={project.technologies.join(', ')}
                        onChange={(e) => updateProject(catIndex, projIndex, 'technologies', e.target.value.split(',').map(t => t.trim()))}
                      />
                    </div>

                    <div className="form-group">
                      <label>GitHub URL</label>
                      <input
                        type="url"
                        value={project.githubUrl}
                        onChange={(e) => updateProject(catIndex, projIndex, 'githubUrl', e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label>Live URL</label>
                      <input
                        type="url"
                        value={project.liveUrl}
                        onChange={(e) => updateProject(catIndex, projIndex, 'liveUrl', e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label>Documentation URL</label>
                      <input
                        type="url"
                        value={project.docsUrl}
                        onChange={(e) => updateProject(catIndex, projIndex, 'docsUrl', e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label>Highlights</label>
                      {project.highlights.map((highlight, hIndex) => (
                        <input
                          key={hIndex}
                          type="text"
                          value={highlight}
                          onChange={(e) => updateProjectHighlight(catIndex, projIndex, hIndex, e.target.value)}
                          style={{ marginBottom: '8px' }}
                        />
                      ))}
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => addProject(catIndex)}
                  className="btn-add-project"
                >
                  + Add Project to {category.name}
                </button>
              </div>
            </div>
          ))}
        </section>
      </div>

      <div className="admin-footer">
        <button onClick={handleSave} disabled={saving} className="btn-save">
          {saving ? 'Saving...' : 'Save All Changes'}
        </button>
      </div>
    </div>
  );
}

export default Admin;
