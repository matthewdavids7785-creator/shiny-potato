import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import '@phosphor-icons/web/regular';
import '@phosphor-icons/web/fill';
import '@phosphor-icons/web/bold';

// --- COMPONENTS ---

const LiveCounter = () => {
    const [count, setCount] = useState(243);
    useEffect(() => {
        const interval = setInterval(() => { setCount(prev => prev + (Math.random() > 0.5 ? 1 : -1)); }, 3500);
        return () => clearInterval(interval);
    }, []);
    return (
        <div className="live-badge-container inline-flex items-center gap-3 px-5 py-2 rounded-full mb-8 animate-fade-in relative z-20">
            <span className="relative flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-500 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-accent-500"></span></span>
            <span className="text-sm font-bold text-white tracking-wide"><span className="text-accent-500">{count}</span> Recruiters Scouting Live</span>
        </div>
    );
};

const Navbar = ({ isRecruiter, toggleRecruiter, goHome, goToUpload }) => (
    <nav className="fixed top-0 w-full z-50 glass-card border-b-0 border-b-white/5 h-20">
        <div className="container mx-auto px-6 h-full flex items-center justify-between">
            <div className="flex flex-col justify-center cursor-pointer group" onClick={goHome}>
                <div className="flex items-center gap-2 text-white font-bold text-xl tracking-tight">
                    <div className="w-8 h-8 bg-accent-500 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform"><i className="ph-bold ph-chart-polar text-black"></i></div>
                    AfriData
                </div>
                <p className="text-[10px] text-gray-400 font-medium ml-10 -mt-1 tracking-wide hidden md:block">Connecting the world to Africa's verified data genius.</p>
            </div>
            <div className="flex items-center gap-4">
                {/* MOBILE: Icon Only */}
                <button onClick={goToUpload} className="md:hidden text-accent-500 text-2xl p-2">
                    <i className="ph-bold ph-plus-circle"></i>
                </button>

                {/* DESKTOP: Full Button */}
                <button onClick={goToUpload} className="hidden md:flex items-center gap-2 text-gray-300 hover:text-white font-bold text-sm transition-colors mr-4">
                    <i className="ph-bold ph-plus-circle text-accent-500"></i> Submit Project
                </button>
                
                <div className="flex items-center gap-2 bg-base-900 p-1 rounded-lg border border-white/10">
                    <button onClick={(e) => { e.stopPropagation(); toggleRecruiter(false); }} className={`px-4 py-2 rounded text-sm font-bold transition ${!isRecruiter ? 'bg-base-700 text-white' : 'text-gray-500 hover:text-white'}`}>Candidate</button>
                    <button onClick={(e) => { e.stopPropagation(); toggleRecruiter(true); }} className={`px-4 py-2 rounded text-sm font-bold transition ${isRecruiter ? 'bg-white text-black' : 'text-gray-500 hover:text-white'}`}>Recruiter</button>
                </div>
            </div>
        </div>
    </nav>
);

// --- NEW: UPLOAD FORM COMPONENT ---
const UploadForm = ({ goBack }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '', lastName: '', email: '', 
        title: '', role: 'Data Analyst', tools: '', 
        description: '', projectLink: '', githubLink: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        // Combine Name
        const fullName = `${formData.firstName} ${formData.lastName}`;
        // Split tools by comma
        const toolsArray = formData.tools.split(',').map(t => t.trim());

        try {
            const { error } = await supabase.from('projects').insert({
                title: formData.title,
                author_name: fullName,
                author_email: formData.email, // Saved privately
                role_title: formData.role,
                description: formData.description,
                tools: toolsArray,
                project_url: formData.projectLink,
                repo_url: formData.githubLink,
                // Using a random placeholder image for now until we set up Storage
                image_url: `https://source.unsplash.com/random/800x600/?data,technology,${Math.random()}`, 
                verified: false // Always false until you review it
            });

            if (error) throw error;
            alert("Project Submitted for Verification! It will appear once approved.");
            goBack();
        } catch (error) {
            alert("Error uploading: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-24 px-4 container mx-auto pb-20 max-w-2xl animate-fade-in">
            <button onClick={goBack} className="flex items-center gap-2 text-gray-400 hover:text-white mb-8"><i className="ph-bold ph-arrow-left"></i> Cancel & Return</button>
            
            <div className="glass-card p-8 rounded-2xl border border-white/10">
                <h2 className="text-3xl font-bold text-white mb-2">Submit your Work</h2>
                <p className="text-gray-400 mb-8">Showcase your best data projects to international recruiters.</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">First Name</label>
                            <input required type="text" className="w-full bg-base-900 border border-white/10 rounded-lg p-3 text-white focus:border-accent-500 outline-none" onChange={e => setFormData({...formData, firstName: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Last Name</label>
                            <input required type="text" className="w-full bg-base-900 border border-white/10 rounded-lg p-3 text-white focus:border-accent-500 outline-none" onChange={e => setFormData({...formData, lastName: e.target.value})} />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email Address (Private)</label>
                        <input required type="email" placeholder="For recruiters to contact you" className="w-full bg-base-900 border border-white/10 rounded-lg p-3 text-white focus:border-accent-500 outline-none" onChange={e => setFormData({...formData, email: e.target.value})} />
                    </div>

                    <div className="h-px bg-white/10 w-full my-2"></div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Project Title</label>
                        <input required type="text" placeholder="e.g. Lagos Traffic Analysis Dashboard" className="w-full bg-base-900 border border-white/10 rounded-lg p-3 text-white focus:border-accent-500 outline-none" onChange={e => setFormData({...formData, title: e.target.value})} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Role</label>
                            <select className="w-full bg-base-900 border border-white/10 rounded-lg p-3 text-white focus:border-accent-500 outline-none" onChange={e => setFormData({...formData, role: e.target.value})}>
                                <option>Data Analyst</option>
                                <option>Data Scientist</option>
                                <option>Analytics Engineer</option>
                                <option>ML Engineer</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Tools Used</label>
                            <input required type="text" placeholder="Python, SQL, PowerBI" className="w-full bg-base-900 border border-white/10 rounded-lg p-3 text-white focus:border-accent-500 outline-none" onChange={e => setFormData({...formData, tools: e.target.value})} />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Project Link (Dashboard/Live)</label>
                        <input type="url" placeholder="https://..." className="w-full bg-base-900 border border-white/10 rounded-lg p-3 text-white focus:border-accent-500 outline-none" onChange={e => setFormData({...formData, projectLink: e.target.value})} />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">GitHub Repo (Required for Verification)</label>
                        <input required type="url" placeholder="https://github.com/..." className="w-full bg-base-900 border border-white/10 rounded-lg p-3 text-white focus:border-accent-500 outline-none" onChange={e => setFormData({...formData, githubLink: e.target.value})} />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description</label>
                        <textarea required rows="4" className="w-full bg-base-900 border border-white/10 rounded-lg p-3 text-white focus:border-accent-500 outline-none" onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
                    </div>

                    <button disabled={loading} type="submit" className="w-full bg-accent-500 hover:bg-accent-400 text-black font-bold py-4 rounded-xl transition-all shadow-lg shadow-accent-500/20">
                        {loading ? "Uploading..." : "Submit Project"}
                    </button>
                </form>
            </div>
        </div>
    );
};

const ProjectDetailView = ({ project, goBack }) => (
    <div className="min-h-screen pt-24 px-6 container mx-auto animate-fade-in pb-20">
        <button onClick={goBack} className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"><i className="ph-bold ph-arrow-left"></i> Back to Talent Pool</button>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="space-y-6">
                <div className="h-[400px] rounded-2xl overflow-hidden border border-white/10 relative group">
                    <img src={project.image_url || "https://via.placeholder.com/800"} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        {project.project_url && <a href={project.project_url} target="_blank" className="bg-white text-black px-6 py-3 rounded-full font-bold hover:scale-105 transition-transform">Open Interactive View</a>}
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="bg-base-800 p-4 rounded-xl border border-white/5 flex-1 text-center">
                        <p className="text-gray-400 text-xs uppercase">Tools Used</p>
                        <div className="flex justify-center gap-2 mt-2 flex-wrap">{project.tools && project.tools.map((t,i) => <span key={i} className="text-xs bg-white/10 px-2 py-1 rounded">{t}</span>)}</div>
                    </div>
                    <div className="bg-base-800 p-4 rounded-xl border border-white/5 flex-1 text-center">
                        <p className="text-gray-400 text-xs uppercase">Verified Code</p>
                        {project.verified ? <p className="text-green-500 font-bold text-sm mt-1 flex items-center justify-center gap-1"><i className="ph-fill ph-check-circle"></i> Passed</p> : <p className="text-gray-500 font-bold text-sm mt-1">Pending Review</p>}
                    </div>
                </div>
            </div>
            <div className="glass-card p-8 rounded-2xl">
                <h1 className="text-3xl font-bold text-white mb-2">{project.title}</h1>
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 rounded-full bg-accent-500 flex items-center justify-center text-black font-bold">{project.author_name ? project.author_name.charAt(0) : "?"}</div>
                    <p className="text-gray-300">By <span className="text-white font-bold">{project.author_name || "Unknown"}</span></p>
                    <span className="text-gray-600">•</span>
                    <p className="text-accent-400 text-sm font-bold">{project.role_title}</p>
                </div>
                <div className="h-px bg-white/10 w-full my-6"></div>
                <h3 className="text-lg font-bold text-white mb-3">Project Summary</h3>
                <p className="text-gray-400 leading-relaxed mb-6">{project.description || "No description provided."}</p>
                {project.repo_url && <a href={project.repo_url} target="_blank" className="block w-full text-center border border-white/10 hover:bg-white/5 text-white font-bold py-3 rounded-xl mb-3 transition-colors"><i className="ph-bold ph-github-logo"></i> View Source Code</a>}
                <button className="w-full bg-accent-500 hover:bg-accent-400 text-black font-bold py-4 rounded-xl transition-all mb-4">Unlock Candidate Contact</button>
                <p className="text-center text-xs text-gray-500">Recruiter Mode: 1 Credit will be used.</p>
            </div>
        </div>
    </div>
);

const Card = ({ p, isRecruiter, onViewProject }) => {
    const [unlocked, setUnlocked] = useState(false);
    
    // NEW: WAITLIST LOGIC
    const handleWaitlist = () => {
        const email = prompt("We are launching payments next week! Enter your work email to get 1 Free Credit when we go live:");
        if (email && email.includes("@")) {
            // Save this to Supabase (We reuse the 'projects' table for now or just log it)
            // For MVP, we just alert success to keep them happy
            alert(`Thanks! We sent a confirmation to ${email}. You are on the list.`);
        }
    };

    return (
        <div className="glass-card rounded-2xl overflow-hidden relative group transition-all duration-500 hover:-translate-y-2 h-full flex flex-col">
            <div className="h-56 relative overflow-hidden shrink-0">
                {p.verified && <div className="absolute top-3 left-3 z-30 bg-yellow-400 text-black text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-lg shadow-yellow-400/20"><i className="ph-fill ph-seal-check"></i> VERIFIED CODE</div>}
                <div className="absolute inset-0 bg-gradient-to-t from-base-900 via-transparent to-transparent z-10"></div>
                <img src={p.image_url || "https://via.placeholder.com/800"} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={p.title} />
                
                {isRecruiter && !unlocked && (
                    <div className="absolute inset-0 bg-base-900/60 backdrop-blur-[3px] z-20 flex flex-col items-center justify-center text-center p-4 animate-fade-in">
                        <div className="bg-base-900/80 p-3 rounded-full mb-2">
                            <i className="ph-fill ph-lock-key text-3xl text-accent-500"></i>
                        </div>
                        <p className="text-white font-bold text-sm">Unlock to see details</p>
                    </div>
                )}
            </div>

            <div className="p-5 flex flex-col flex-grow relative z-20">
                <div className="mb-3">
                    <h3 className="text-lg font-bold text-white leading-tight truncate">{unlocked ? p.author_name : p.author_name}</h3>
                    <p className="text-accent-400 text-xs font-bold uppercase tracking-wider mt-1">{p.role_title}</p>
                </div>
                <h4 className="text-gray-300 text-sm font-medium mb-3 line-clamp-2">{p.title}</h4>
                
                {unlocked ? (
                    <div className="mt-auto space-y-3 animate-fade-in pt-4 border-t border-white/5">
                         <div className="bg-green-500/10 border border-green-500/20 p-2 rounded-lg flex items-center justify-center gap-2 text-green-500 text-xs font-bold"><i className="ph-bold ph-check-circle"></i> Contact Revealed</div>
                         <div className="grid grid-cols-2 gap-2">
                            <button className="bg-white text-black py-2 rounded-md font-bold text-xs flex items-center justify-center gap-2 hover:bg-gray-200 transition"><i className="ph-bold ph-download-simple"></i> Resume</button>
                            <button className="bg-accent-500 text-black font-bold py-2 rounded-md text-xs flex items-center justify-center gap-2 hover:bg-accent-400 transition"><i className="ph-bold ph-envelope"></i> Email</button>
                         </div>
                    </div>
                ) : (
                    <div className="mt-auto">
                        <div className="flex flex-wrap gap-2 mb-4">{p.tools && p.tools.map(t => <span key={t} className="text-[10px] bg-white/5 text-gray-400 px-2 py-1 rounded border border-white/5">{t}</span>)}</div>
                        <div className="pt-4 border-t border-white/5">
                            {isRecruiter ? (
                                // SAFE "REQUEST ACCESS" BUTTON
                                <button onClick={handleWaitlist} className="w-full bg-base-800 border border-white/20 text-white font-bold py-3 rounded-lg hover:bg-base-700 transition-all flex items-center justify-center gap-2">
                                    <i className="ph-bold ph-hourglass-high text-accent-500"></i> Request Access
                                </button>
                            ) : (
                                <button onClick={() => onViewProject(p)} className="w-full bg-white/5 hover:bg-white/10 text-white font-semibold py-3 rounded-lg border border-white/10 transition-all flex items-center justify-center gap-2 group-hover:border-accent-500/50">
                                    View Portfolio <i className="ph-bold ph-arrow-right group-hover:translate-x-1 transition-transform"></i>
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const App = () => {
    const [isRecruiter, setIsRecruiter] = useState(false);
    const [activeView, setActiveView] = useState('home'); // 'home', 'project', 'upload'
    const [selectedProject, setSelectedProject] = useState(null);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchProjects(); }, [activeView]); // Refetch when view changes (e.g. after upload)

    const fetchProjects = async () => {
        try {
            let { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
            if (error) throw error;
            setProjects(data);
        } catch (error) { console.error('Error fetching projects:', error.message); } finally { setLoading(false); }
    };

    const handleGoHome = () => { setActiveView('home'); setSelectedProject(null); };
    const handleViewProject = (project) => { setSelectedProject(project); setActiveView('project'); window.scrollTo(0,0); };
    const handleGoToUpload = () => { setActiveView('upload'); window.scrollTo(0,0); };

    return (
        <div className="min-h-screen w-full relative bg-base-900">
            <div className="hero-glow absolute top-0 left-0 w-full h-[800px] pointer-events-none z-0"></div>
            <Navbar isRecruiter={isRecruiter} toggleRecruiter={setIsRecruiter} goHome={handleGoHome} goToUpload={handleGoToUpload} />
            
            {activeView === 'home' && (
                <main className="w-full relative z-10">
                    <div className="pt-36 pb-16 px-6 text-center">
                        <div className="flex justify-center"><LiveCounter /></div>
                        <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight leading-tight drop-shadow-2xl">Hire Proven <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-500 to-orange-300">African Talent.</span></h1>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-10">The only portfolio platform that verifies the code behind the dashboard. <br className="hidden md:block" /><span className={`transition-colors duration-300 ${isRecruiter ? "text-accent-500 font-bold" : "text-gray-500"}`}>{isRecruiter ? "✅ Recruiter Mode Active: Unlock profiles below." : "Stop guessing, start hiring."}</span></p>
                    </div>
                    <div className="container mx-auto px-6 pb-20">
                        {loading ? <div className="text-center text-gray-500">Loading Talent...</div> : projects.length === 0 ? <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10"><i className="ph-bold ph-empty text-4xl text-gray-600 mb-4"></i><h3 className="text-xl font-bold text-white">No Projects Yet</h3></div> : 
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">{projects.map(p => <Card key={p.id} p={p} isRecruiter={isRecruiter} onViewProject={handleViewProject} />)}</div>
                        }
                    </div>
                </main>
            )}
            {activeView === 'project' && selectedProject && <ProjectDetailView project={selectedProject} goBack={handleGoHome} />}
            {activeView === 'upload' && <UploadForm goBack={handleGoHome} />}
        </div>
    );
};

export default App;