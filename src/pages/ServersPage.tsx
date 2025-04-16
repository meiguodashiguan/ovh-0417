
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAPI } from "@/context/APIContext";
import axios from "axios";
import { toast } from "sonner";

// Backend API URL (update this to match your backend)
const API_URL = 'http://localhost:5000/api';

interface ServerOption {
  label: string;
  value: string;
}

interface ServerPlan {
  planCode: string;
  name: string;
  description?: string;
  cpu: string;
  memory: string;
  storage: string;
  bandwidth: string;
  vrackBandwidth: string;
  defaultOptions: ServerOption[];
  availableOptions: ServerOption[];
  datacenters: {
    datacenter: string;
    availability: string;
  }[];
}

interface FetchParams {
  showApiServers: boolean;
}

const ServersPage = () => {
  const { isAuthenticated } = useAPI();
  const [servers, setServers] = useState<ServerPlan[]>([]);
  const [filteredServers, setFilteredServers] = useState<ServerPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showApiServers, setShowApiServers] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDatacenter, setSelectedDatacenter] = useState<string>("all");
  const [datacenters, setDatacenters] = useState<string[]>([]);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [availability, setAvailability] = useState<Record<string, Record<string, string>>>({});

  // Fetch servers from the backend
  const fetchServers = async (params: FetchParams) => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_URL}/servers`, {
        params: {
          showApiServers: params.showApiServers,
        },
      });
      
      setServers(response.data);
      setFilteredServers(response.data);
      
      // Extract unique datacenters
      const dcSet = new Set<string>();
      response.data.forEach((server: ServerPlan) => {
        server.datacenters.forEach(dc => {
          dcSet.add(dc.datacenter);
        });
      });
      setDatacenters(Array.from(dcSet));
      
    } catch (error) {
      console.error("Error fetching servers:", error);
      toast.error("获取服务器列表失败");
    } finally {
      setIsLoading(false);
    }
  };

  // Check availability for a specific server plan
  const checkAvailability = async (planCode: string) => {
    if (!isAuthenticated) {
      toast.error("请先配置 API 设置");
      return;
    }
    
    setIsCheckingAvailability(true);
    try {
      const response = await axios.get(`${API_URL}/availability/${planCode}`);
      
      setAvailability(prev => ({
        ...prev,
        [planCode]: response.data
      }));
      
      toast.success(`已更新 ${planCode} 可用性信息`);
    } catch (error) {
      console.error(`Error checking availability for ${planCode}:`, error);
      toast.error(`获取 ${planCode} 可用性失败`);
    } finally {
      setIsCheckingAvailability(false);
    }
  };

  // Add server to purchase queue
  const addToQueue = async (server: ServerPlan, datacenter: string) => {
    if (!isAuthenticated) {
      toast.error("请先配置 API 设置");
      return;
    }
    
    try {
      await axios.post(`${API_URL}/queue`, {
        planCode: server.planCode,
        datacenter,
        options: server.defaultOptions.map(opt => opt.value),
      });
      
      toast.success("已添加到抢购队列");
    } catch (error) {
      console.error("Error adding to queue:", error);
      toast.error("添加到抢购队列失败");
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchServers({ showApiServers });
  }, [showApiServers]);

  // Apply filters when search term or datacenter changes
  useEffect(() => {
    if (servers.length === 0) return;
    
    let filtered = [...servers];
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        server => 
          server.planCode.toLowerCase().includes(term) ||
          server.name.toLowerCase().includes(term) ||
          server.cpu.toLowerCase().includes(term) ||
          server.memory.toLowerCase().includes(term)
      );
    }
    
    // Apply datacenter filter
    if (selectedDatacenter !== "all") {
      filtered = filtered.filter(server => 
        server.datacenters.some(dc => dc.datacenter === selectedDatacenter)
      );
    }
    
    setFilteredServers(filtered);
  }, [searchTerm, selectedDatacenter, servers]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-3xl font-bold mb-1 cyber-glow-text">服务器列表</h1>
        <p className="text-cyber-muted mb-6">浏览可用服务器与实时可用性检测</p>
      </motion.div>

      {/* Filters and controls */}
      <div className="cyber-panel p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cyber-muted">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
            <input
              type="text"
              placeholder="搜索服务器..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="cyber-input pl-10 w-full"
            />
          </div>
          
          <div>
            <select
              value={selectedDatacenter}
              onChange={(e) => setSelectedDatacenter(e.target.value)}
              className="cyber-input w-full"
            >
              <option value="all">所有数据中心</option>
              {datacenters.map((dc) => (
                <option key={dc} value={dc}>{dc}</option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center space-x-4">
            <label className="cursor-pointer flex items-center space-x-2 text-cyber-muted hover:text-cyber-text transition-colors">
              <input
                type="checkbox"
                checked={showApiServers}
                onChange={() => setShowApiServers(!showApiServers)}
                className="form-checkbox cyber-input h-4 w-4"
              />
              <span className="text-sm">显示API服务器</span>
            </label>
            
            <button
              onClick={() => fetchServers({ showApiServers })}
              className="cyber-button ml-auto text-xs flex items-center"
              disabled={isLoading}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                <polyline points="1 4 1 10 7 10"></polyline>
                <polyline points="23 20 23 14 17 14"></polyline>
                <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path>
              </svg>
              刷新
            </button>
          </div>
        </div>
      </div>

      {/* Servers grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="cyber-panel h-64 animate-pulse">
              <div className="h-full bg-cyber-grid/30"></div>
            </div>
          ))}
        </div>
      ) : filteredServers.length === 0 ? (
        <div className="cyber-panel p-8 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cyber-muted mx-auto mb-4">
            <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
            <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
            <line x1="6" y1="6" x2="6.01" y2="6"></line>
            <line x1="6" y1="18" x2="6.01" y2="18"></line>
          </svg>
          <p className="text-cyber-muted">没有找到匹配的服务器</p>
          <button 
            onClick={() => {
              setSearchTerm("");
              setSelectedDatacenter("all");
            }}
            className="cyber-button mt-4 text-xs"
          >
            清除筛选
          </button>
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
        >
          {filteredServers.map((server) => (
            <motion.div 
              key={server.planCode}
              variants={itemVariants}
              className="cyber-panel relative overflow-hidden"
            >
              {/* Scan effect */}
              <div className="absolute inset-0 cyber-scan opacity-30"></div>
              
              <div className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-cyber font-bold text-cyber-accent">
                    {server.planCode}
                  </h3>
                  <div className="bg-cyber-grid/50 px-2 py-0.5 rounded text-xs">
                    {server.name}
                  </div>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="cyber-panel p-2 bg-cyber-grid/20">
                      <span className="text-cyber-muted text-xs">CPU</span>
                      <p className="font-medium">{server.cpu}</p>
                    </div>
                    <div className="cyber-panel p-2 bg-cyber-grid/20">
                      <span className="text-cyber-muted text-xs">内存</span>
                      <p className="font-medium">{server.memory}</p>
                    </div>
                    <div className="cyber-panel p-2 bg-cyber-grid/20">
                      <span className="text-cyber-muted text-xs">存储</span>
                      <p className="font-medium">{server.storage}</p>
                    </div>
                    <div className="cyber-panel p-2 bg-cyber-grid/20">
                      <span className="text-cyber-muted text-xs">带宽</span>
                      <p className="font-medium">{server.bandwidth}</p>
                    </div>
                  </div>
                  
                  <div className="cyber-panel p-2 bg-cyber-grid/10">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-cyber-muted text-xs">数据中心可用性</span>
                      <button
                        onClick={() => checkAvailability(server.planCode)}
                        disabled={isCheckingAvailability || !isAuthenticated}
                        className="text-xs text-cyber-accent hover:text-cyber-accent/80 transition-colors"
                      >
                        {isCheckingAvailability ? (
                          <span className="inline-flex items-center">
                            <svg className="animate-spin -ml-1 mr-2 h-3 w-3 text-cyber-accent" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            检查中
                          </span>
                        ) : (
                          <span className="inline-flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                              <circle cx="12" cy="12" r="10"></circle>
                              <line x1="12" y1="16" x2="12" y2="12"></line>
                              <line x1="12" y1="8" x2="12.01" y2="8"></line>
                            </svg>
                            检查可用性
                          </span>
                        )}
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-1 text-xs">
                      {server.datacenters.map((dc) => {
                        // Get availability from our availability state, or use the default from the server
                        const availStatus = availability[server.planCode]?.[dc.datacenter] || dc.availability;
                        
                        let statusClass = "text-yellow-400";
                        if (availStatus === "available") statusClass = "status-available";
                        else if (availStatus === "unavailable") statusClass = "status-unavailable";
                        
                        return (
                          <div 
                            key={dc.datacenter}
                            className={`cyber-panel p-1 text-center ${
                              availStatus === "available" ? "bg-green-500/10" : "bg-cyber-grid/10"
                            }`}
                          >
                            <span className="block">{dc.datacenter}</span>
                            <span className={statusClass}>
                              {availStatus === "available" ? "可用" : 
                               availStatus === "unavailable" ? "不可用" : "未知"}
                            </span>
                            
                            {availStatus === "available" && (
                              <button
                                onClick={() => addToQueue(server, dc.datacenter)}
                                className="mt-1 w-full text-cyber-accent hover:text-cyber-accent/80 transition-colors bg-cyber-accent/10 p-0.5 rounded"
                                disabled={!isAuthenticated}
                              >
                                抢购
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default ServersPage;
