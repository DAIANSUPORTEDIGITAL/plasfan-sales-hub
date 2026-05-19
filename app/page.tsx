// @ts-nocheck
"use client";
import React, { useEffect, useMemo, useState } from "react";
import { Search, ShoppingCart, FileText, Home, Settings, Plus, Minus, Trash2, Send, Package, LogOut, Upload, Edit, Menu, X } from "lucide-react";
import { motion } from "framer-motion";
import { createClient } from "@supabase/supabase-js";
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
const COMPANY = {
  name: "Plasfan",
  appName: "App Comercial Plasfan",
  tagline: "Consulte produtos, monte orçamentos e envie solicitações com agilidade.",
  whatsapp: "5547999999999",
  primary: "#2BA64A",
  secondary: "#132B55",
};

const initialProducts = [
  {
    id: 1,
    code: "PLF-001",
    name: "Mangueira Corrugada 1/2",
    category: "Mangueiras",
    unit: "Metro",
    price: 2.9,
    description: "Mangueira corrugada flexível indicada para instalações diversas.",
    keywords: "mangueira corrugada pvc conduíte",
    image: "https://placehold.co/600x400?text=Mangueira",
    active: true,
  },
  {
    id: 2,
    code: "PLF-002",
    name: "Lona Preta 4x5",
    category: "Lonas",
    unit: "Unidade",
    price: 35,
    description: "Lona resistente para proteção, cobertura e uso geral.",
    keywords: "lona preta cobertura proteção",
    image: "https://placehold.co/600x400?text=Lona",
    active: true,
  },
  {
    id: 3,
    code: "PLF-003",
    name: "Corda Trançada Polipropileno 10mm",
    category: "Cordas",
    unit: "Metro",
    price: 1.75,
    description: "Corda de polipropileno resistente para múltiplas aplicações.",
    keywords: "corda trançada polipropileno",
    image: "https://placehold.co/600x400?text=Corda",
    active: true,
  },
  {
    id: 4,
    code: "PLF-004",
    name: "Tinta 101 Acrílica Branca 18L",
    category: "Tintas",
    unit: "Unidade",
    price: 189.9,
    description: "Tinta acrílica branca para acabamento interno e externo.",
    keywords: "tinta branca acrílica 101",
    image: "https://placehold.co/600x400?text=Tinta+101",
    active: true,
  },
  {
    id: 5,
    code: "PLF-005",
    name: "Barrilha Elevador de pH 2kg",
    category: "Piscina",
    unit: "Unidade",
    price: 22.5,
    description: "Produto para correção do pH da água da piscina.",
    keywords: "barrilha piscina ph elevador",
    image: "https://placehold.co/600x400?text=Barrilha",
    active: true,
  },
];

const materials = [
  { id: 1, title: "Catálogo Institucional Plasfan", type: "PDF", description: "Catálogo geral com as principais linhas de produtos.", url: "#" },
  { id: 2, title: "Campanha Tintas 101", type: "Campanha", description: "Materiais para divulgação comercial da linha Tintas 101.", url: "#" },
  { id: 3, title: "Apresentação Comercial", type: "Apresentação", description: "Apresentação institucional para clientes e parceiros.", url: "#" },
];

function currency(value) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value || 0);
}

function Button({ children, variant = "primary", className = "", ...props }) {
  const base = "inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold transition active:scale-[0.98] disabled:opacity-50";
  const styles = {
    primary: "bg-[#2BA64A] text-white shadow-sm hover:brightness-95",
    secondary: "bg-[#132B55] text-white shadow-sm hover:brightness-110",
    ghost: "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50",
    danger: "bg-red-50 text-red-700 border border-red-100 hover:bg-red-100",
  };
  return <button className={`${base} ${styles[variant]} ${className}`} {...props}>{children}</button>;
}

function Card({ children, className = "" }) {
  return <div className={`rounded-3xl border border-slate-200 bg-white p-4 shadow-sm ${className}`}>{children}</div>;
}

export default function PlasfanSalesHubPrototype() {
  const [logged, setLogged] = useState(false);
  const [role, setRole] = useState("vendedor");
  const [screen, setScreen] = useState("dashboard");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Todos");
  const [cart, setCart] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [mobileMenu, setMobileMenu] = useState(false);
const [dbProducts, setDbProducts] = useState(initialProducts);
const [dbCategories, setDbCategories] = useState([]);
const [loadingProducts, setLoadingProducts] = useState(false);
const [editingProductId, setEditingProductId] = useState(null);
const [uploadingImage, setUploadingImage] = useState(false);
const emptyProductForm = {
  codigo: "",
  nome: "",
  descricao: "",
  unidade: "Unidade",
  preco: "",
  imagem_url: "",
  palavras_chave: "",
  observacoes: "",
  categoria_id: "",
  ativo: true,
};

const [productForm, setProductForm] = useState(emptyProductForm);

async function loadProducts() {
  setLoadingProducts(true);

  const { data, error } = await supabase
    .from("produtos")
    .select(`
      id,
      categoria_id,
      codigo,
      nome,
      descricao,
      unidade,
      preco,
      imagem_url,
      palavras_chave,
      observacoes,
      ativo,
      categorias (
        nome
      )
    `)
    .order("codigo");

  if (!error && data) {
    const formatted = data.map((item: any) => ({
      id: item.id,
      categoryId: item.categoria_id,
      code: item.codigo,
      name: item.nome,
      category: item.categorias?.nome || "Sem categoria",
      unit: item.unidade,
      price: Number(item.preco || 0),
      description: item.descricao || "",
      keywords: item.palavras_chave || "",
      image: item.imagem_url || "https://placehold.co/600x400?text=Produto",
      observacoes: item.observacoes || "",
      active: item.ativo,
    }));

    setDbProducts(formatted);
  }

  setLoadingProducts(false);
}

async function loadCategories() {
  const { data, error } = await supabase
    .from("categorias")
    .select("id, nome, slug")
    .eq("ativo", true)
    .order("ordem");

  if (error) {
    console.error("Erro ao carregar categorias:", error);
    return;
  }

  setDbCategories(data || []);
}

useEffect(() => {
  loadProducts();
  loadCategories();
}, []);
async function startNewProduct() {
  await loadCategories();
  setEditingProductId(null);
  setProductForm(emptyProductForm);
  setScreen("product-form");
}

async function startEditProduct(product: any) {
  await loadCategories();

  setEditingProductId(product.id);

  setProductForm({
    codigo: product.code || "",
    nome: product.name || "",
    descricao: product.description || "",
    unidade: product.unit || "Unidade",
    preco: String(product.price || ""),
    imagem_url: product.image || "",
    palavras_chave: product.keywords || "",
    observacoes: product.observacoes || "",
    categoria_id: product.categoryId || "",
    ativo: true,
  });

  setScreen("product-form");
}
async function uploadProductImage(file: File) {
  if (!file) return;

  setUploadingImage(true);

  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
  const filePath = `produtos/${fileName}`;

  const { error } = await supabase.storage
    .from("produtos")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    console.error("Erro ao enviar imagem:", error);
    alert("Erro ao enviar imagem.");
    setUploadingImage(false);
    return;
  }

  const { data } = supabase.storage
    .from("produtos")
    .getPublicUrl(filePath);

  setProductForm({
    ...productForm,
    imagem_url: data.publicUrl,
  });

  setUploadingImage(false);
}
async function saveProduct() {
  if (!productForm.codigo || !productForm.nome || !productForm.categoria_id) {
    alert("Preencha código, nome e categoria.");
    return;
  }

  const { data: empresa, error: empresaError } = await supabase
    .from("empresas")
    .select("id")
    .eq("slug", "plasfan")
    .single();

  if (empresaError || !empresa) {
    alert("Erro ao localizar a empresa Plasfan.");
    return;
  }

  const payload = {
    empresa_id: empresa.id,
    categoria_id: productForm.categoria_id,
    codigo: productForm.codigo,
    nome: productForm.nome,
    descricao: productForm.descricao,
    unidade: productForm.unidade,
    preco: Number(String(productForm.preco).replace(",", ".")) || 0,
    imagem_url: productForm.imagem_url,
    palavras_chave: productForm.palavras_chave,
    observacoes: productForm.observacoes,
    ativo: productForm.ativo,
  };

  let response;

  if (editingProductId) {
    response = await supabase
      .from("produtos")
      .update(payload)
      .eq("id", editingProductId);
  } else {
    response = await supabase
      .from("produtos")
      .insert(payload);
  }

  if (response.error) {
    alert("Erro ao salvar produto.");
    console.error(response.error);
    return;
  }

  alert("Produto salvo com sucesso!");
  setProductForm(emptyProductForm);
  setEditingProductId(null);
  await loadProducts();
  setScreen("admin-products");
}

async function toggleProductStatus(productId: string, currentStatus: boolean) {
  const actionText = currentStatus ? "desativar" : "reativar";
  const confirmAction = confirm(`Deseja ${actionText} este produto?`);

  if (!confirmAction) return;

  const { error } = await supabase
    .from("produtos")
    .update({ ativo: !currentStatus })
    .eq("id", productId);

  if (error) {
    alert(`Erro ao ${actionText} produto.`);
    return;
  }

  await loadProducts();
}
  const products = dbProducts.filter((p) => p.active);
  const adminProducts = dbProducts;
  const categories = ["Todos", ...Array.from(new Set(products.map((p) => p.category)))];

  const filteredProducts = useMemo(() => {
    const term = query.toLowerCase().trim();
    return products.filter((product) => {
      const matchesCategory = category === "Todos" || product.category === category;
      const content = `${product.code} ${product.name} ${product.category} ${product.description} ${product.keywords}`.toLowerCase();
      return matchesCategory && (!term || content.includes(term));
    });
  }, [query, category, products]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const total = cart.reduce((sum, item) => sum + item.quantity * item.price, 0);

  function addToCart(product, quantity = 1) {
    setCart((current) => {
      const exists = current.find((item) => item.id === product.id);
      if (exists) {
        return current.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item);
      }
      return [...current, { ...product, quantity }];
    });
  }

  function updateQuantity(productId, quantity) {
    if (quantity <= 0) {
      setCart((current) => current.filter((item) => item.id !== productId));
      return;
    }
    setCart((current) => current.map((item) => item.id === productId ? { ...item, quantity } : item));
  }

  function buildWhatsappMessage() {
    const lines = [];
    lines.push("Olá! Segue solicitação de orçamento pelo App Comercial Plasfan:");
    lines.push("");
    if (clientName) lines.push(`Cliente: ${clientName}`);
    if (clientPhone) lines.push(`Telefone: ${clientPhone}`);
    if (clientName || clientPhone) lines.push("");
    lines.push("Itens solicitados:");
    lines.push("");
    cart.forEach((item, index) => {
      lines.push(`${index + 1}. ${item.name}`);
      lines.push(`Código: ${item.code}`);
      lines.push(`Quantidade: ${item.quantity}`);
      lines.push(`Unidade: ${item.unit}`);
      lines.push(`Valor unitário: ${currency(item.price)}`);
      lines.push(`Subtotal: ${currency(item.price * item.quantity)}`);
      lines.push("");
    });
    lines.push(`Total estimado: ${currency(total)}`);
    if (notes) {
      lines.push("");
      lines.push("Observações:");
      lines.push(notes);
    }
    lines.push("");
    lines.push("Aguardo retorno.");
    return lines.join("\n");
  }

  function sendWhatsapp() {
    const url = `https://wa.me/${COMPANY.whatsapp}?text=${encodeURIComponent(buildWhatsappMessage())}`;
    window.open(url, "_blank");
  }

  if (!logged) {
    return (
      <div className="min-h-screen bg-slate-100 p-4 flex items-center justify-center">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <Card className="p-8">
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-[#2BA64A] text-white shadow-sm">
                <Package size={32} />
              </div>
              <h1 className="text-2xl font-bold text-[#132B55]">{COMPANY.appName}</h1>
              <p className="mt-2 text-sm text-slate-600">{COMPANY.tagline}</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700">E-mail</label>
                <input className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-[#2BA64A]" defaultValue="vendedor@plasfan.com.br" />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Senha</label>
                <input type="password" className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-[#2BA64A]" defaultValue="123456" />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Perfil para testar</label>
                <select value={role} onChange={(e) => setRole(e.target.value)} className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-[#2BA64A]">
                  <option value="vendedor">Vendedor</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>
              <Button className="w-full" onClick={() => setLogged(true)}>Entrar</Button>
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }

const navItems = [
  { id: "dashboard", label: "Início", icon: Home },
  { id: "catalog", label: "Catálogo", icon: Search },
  { id: "quote", label: "Orçamento", icon: ShoppingCart },
  { id: "materials", label: "Materiais", icon: FileText },
];

if (role === "admin") {
  navItems.push({ id: "admin", label: "Administrador", icon: Settings });
}

  const Header = () => (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#2BA64A] text-white"><Package size={20} /></div>
          <div>
            <div className="font-bold text-[#132B55]">{COMPANY.appName}</div>
            <div className="text-xs text-slate-500">Perfil: {role === "admin" ? "Administrador" : "Vendedor"}</div>
          </div>
        </div>
        <div className="hidden items-center gap-2 md:flex">
          {navItems.map((item) => <Button key={item.id} variant={screen === item.id ? "primary" : "ghost"} onClick={() => setScreen(item.id)}><item.icon size={16} />{item.label}</Button>)}
          <Button variant="ghost" onClick={() => setLogged(false)}><LogOut size={16} />Sair</Button>
        </div>
        <button className="md:hidden" onClick={() => setMobileMenu(true)}><Menu /></button>
      </div>
      {mobileMenu && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 md:hidden" onClick={() => setMobileMenu(false)}>
          <div className="ml-auto h-full w-72 bg-white p-4" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <strong>Menu</strong>
              <button onClick={() => setMobileMenu(false)}><X /></button>
            </div>
            <div className="grid gap-2">
              {navItems.map((item) => <Button key={item.id} variant={screen === item.id ? "primary" : "ghost"} className="justify-start" onClick={() => { setScreen(item.id); setMobileMenu(false); }}><item.icon size={16} />{item.label}</Button>)}
              <Button variant="ghost" className="justify-start" onClick={() => setLogged(false)}><LogOut size={16} />Sair</Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );

  const BottomNav = () => (
    <nav className="fixed bottom-0 left-0 right-0 z-20 border-t border-slate-200 bg-white md:hidden">
      <div className="grid" style={{ gridTemplateColumns: `repeat(${Math.min(navItems.length, 5)}, 1fr)` }}>
        {navItems.slice(0, 5).map((item) => (
          <button key={item.id} onClick={() => setScreen(item.id)} className={`flex flex-col items-center gap-1 px-1 py-2 text-[11px] ${screen === item.id ? "text-[#2BA64A]" : "text-slate-500"}`}>
            <item.icon size={19} />
            {item.label}
          </button>
        ))}
      </div>
    </nav>
  );

  const Dashboard = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#132B55]">Catálogo de Produtos</h2>
        <p className="text-slate-600">Busque produtos e adicione à lista de orçamento.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="cursor-pointer hover:shadow-md" onClick={() => setScreen("catalog")}>
          <Search className="mb-4 text-[#2BA64A]" size={30} />
          <h3 className="font-bold text-[#132B55]">Catálogo de Produtos</h3>
          <p className="mt-1 text-sm text-slate-600">Pesquise produtos por nome, código ou categoria.</p>
        </Card>
        <Card className="cursor-pointer hover:shadow-md" onClick={() => setScreen("quote")}>
          <ShoppingCart className="mb-4 text-[#2BA64A]" size={30} />
          <h3 className="font-bold text-[#132B55]">Lista de Orçamento</h3>
          <p className="mt-1 text-sm text-slate-600">Revise itens e envie a solicitação pelo WhatsApp.</p>
        </Card>
        <Card className="cursor-pointer hover:shadow-md" onClick={() => setScreen("materials")}>
          <FileText className="mb-4 text-[#2BA64A]" size={30} />
          <h3 className="font-bold text-[#132B55]">Materiais Comerciais</h3>
          <p className="mt-1 text-sm text-slate-600">Acesse catálogos, campanhas e apresentações.</p>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Card><div className="text-3xl font-bold text-[#132B55]">{products.length}</div><p className="text-sm text-slate-600">Produtos cadastrados</p></Card>
        <Card><div className="text-3xl font-bold text-[#132B55]">{categories.length - 1}</div><p className="text-sm text-slate-600">Categorias ativas</p></Card>
        <Card><div className="text-3xl font-bold text-[#132B55]">{cartCount}</div><p className="text-sm text-slate-600">Itens na lista atual</p></Card>
      </div>
    </div>
  );

  const Catalog = () => (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
        <div>
          <h2 className="text-2xl font-bold text-[#132B55]">Catálogo de Produtos</h2>
          <p className="text-slate-600">Busque produtos e adicione à lista de orçamento.</p>
        </div>
        <Button variant="secondary" onClick={() => setScreen("quote")}><ShoppingCart size={18} />Lista ({cartCount})</Button>
      </div>
      <Card>
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3">
          <Search size={20} className="text-slate-400" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar por nome, código, categoria ou palavra-chave..." className="w-full outline-none" />
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {categories.map((cat) => <button key={cat} onClick={() => setCategory(cat)} className={`rounded-full px-4 py-2 text-sm font-medium ${category === cat ? "bg-[#2BA64A] text-white" : "bg-slate-100 text-slate-700"}`}>{cat}</button>)}
        </div>
      </Card>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredProducts.map((product) => (
          <Card key={product.id}>
            <img
  src={product.image}
  alt={product.name}
  className="mb-4 h-44 w-full rounded-2xl bg-slate-100 object-contain p-3"
/>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#2BA64A]">{product.category}</div>
            <h3 className="font-bold text-[#132B55]">{product.name}</h3>
            <p className="mt-1 text-sm text-slate-600">Código: {product.code}</p>
            <p className="text-sm text-slate-600">Unidade: {product.unit}</p>
            <p className="mt-2 text-lg font-bold text-slate-900">{currency(product.price)}</p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <Button onClick={() => addToCart(product)}><Plus size={16} />Adicionar</Button>
              <Button variant="ghost" onClick={() => { setSelectedProduct(product); setScreen("detail"); }}>Detalhes</Button>
            </div>
          </Card>
        ))}
      </div>
      {filteredProducts.length === 0 && <Card><p className="text-center text-slate-600">Nenhum produto encontrado.</p></Card>}
    </div>
  );

  const Detail = () => {
    const [qty, setQty] = useState(1);
    if (!selectedProduct) return <Catalog />;
    return (
      <div className="mx-auto max-w-3xl space-y-5">
        <Button variant="ghost" onClick={() => setScreen("catalog")}>Voltar ao catálogo</Button>
        <Card className="p-5">
          <img src={selectedProduct.image} alt="" className="mb-5 h-64 w-full rounded-3xl object-cover bg-slate-100" />
          <div className="text-sm font-semibold uppercase text-[#2BA64A]">{selectedProduct.category}</div>
          <h2 className="mt-1 text-2xl font-bold text-[#132B55]">{selectedProduct.name}</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <div className="rounded-2xl bg-slate-50 p-3"><span className="text-xs text-slate-500">Código</span><div className="font-bold">{selectedProduct.code}</div></div>
            <div className="rounded-2xl bg-slate-50 p-3"><span className="text-xs text-slate-500">Unidade</span><div className="font-bold">{selectedProduct.unit}</div></div>
            <div className="rounded-2xl bg-slate-50 p-3"><span className="text-xs text-slate-500">Preço</span><div className="font-bold">{currency(selectedProduct.price)}</div></div>
          </div>
          <p className="mt-5 text-slate-700">{selectedProduct.description}</p>
          <div className="mt-5 flex items-center gap-3">
            <Button variant="ghost" onClick={() => setQty(Math.max(1, qty - 1))}><Minus size={16} /></Button>
            <div className="min-w-12 text-center text-xl font-bold">{qty}</div>
            <Button variant="ghost" onClick={() => setQty(qty + 1)}><Plus size={16} /></Button>
          </div>
          <Button className="mt-5 w-full" onClick={() => { addToCart(selectedProduct, qty); setScreen("quote"); }}><ShoppingCart size={18} />Adicionar à lista de orçamento</Button>
        </Card>
      </div>
    );
  };

  const Quote = () => (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
        <div>
          <h2 className="text-2xl font-bold text-[#132B55]">Lista de Orçamento</h2>
          <p className="text-slate-600">Revise os produtos selecionados antes de enviar.</p>
        </div>
        <Button variant="ghost" onClick={() => setScreen("catalog")}><Plus size={16} />Adicionar produtos</Button>
      </div>
      <Card>
        <div className="grid gap-3 md:grid-cols-3">
          <input value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder="Nome do cliente" className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-[#2BA64A]" />
          <input value={clientPhone} onChange={(e) => setClientPhone(e.target.value)} placeholder="Telefone do cliente" className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-[#2BA64A]" />
          <input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Observações" className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-[#2BA64A]" />
        </div>
      </Card>
      <div className="space-y-3">
        {cart.map((item) => (
          <Card key={item.id}>
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="font-bold text-[#132B55]">{item.name}</h3>
                <p className="text-sm text-slate-600">Código: {item.code} • Unidade: {item.unit}</p>
                <p className="mt-1 text-sm text-slate-600">Valor unitário: {currency(item.price)}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" onClick={() => updateQuantity(item.id, item.quantity - 1)}><Minus size={14} /></Button>
                <div className="w-10 text-center font-bold">{item.quantity}</div>
                <Button variant="ghost" onClick={() => updateQuantity(item.id, item.quantity + 1)}><Plus size={14} /></Button>
                <Button variant="danger" onClick={() => updateQuantity(item.id, 0)}><Trash2 size={14} /></Button>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-500">Subtotal</div>
                <div className="text-lg font-bold">{currency(item.price * item.quantity)}</div>
              </div>
            </div>
          </Card>
        ))}
        {cart.length === 0 && <Card><p className="text-center text-slate-600">Sua lista está vazia. Adicione produtos pelo catálogo.</p></Card>}
      </div>
      <Card className="sticky bottom-20 md:bottom-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-sm text-slate-500">Total estimado</div>
            <div className="text-3xl font-bold text-[#132B55]">{currency(total)}</div>
          </div>
          <div className="flex flex-col gap-2 md:flex-row">
            <Button variant="danger" disabled={cart.length === 0} onClick={() => setCart([])}><Trash2 size={16} />Limpar lista</Button>
            <Button disabled={cart.length === 0} onClick={sendWhatsapp}><Send size={16} />Enviar pelo WhatsApp</Button>
          </div>
        </div>
      </Card>
    </div>
  );

  const Materials = () => (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-[#132B55]">Materiais Comerciais</h2>
        <p className="text-slate-600">Catálogos, campanhas e apresentações para apoio à venda.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {materials.map((material) => (
          <Card key={material.id}>
            <FileText className="mb-4 text-[#2BA64A]" size={30} />
            <div className="mb-2 text-xs font-semibold uppercase text-[#2BA64A]">{material.type}</div>
            <h3 className="font-bold text-[#132B55]">{material.title}</h3>
            <p className="mt-2 text-sm text-slate-600">{material.description}</p>
            <Button className="mt-4 w-full" variant="ghost">Abrir material</Button>
          </Card>
        ))}
      </div>
    </div>
  );
const AdminProducts = () => (
  <div className="space-y-5">
    <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
      <div>
        <h2 className="text-2xl font-bold text-[#132B55]">Gerenciar Produtos</h2>
        <p className="text-slate-600">Cadastre, edite, desative ou reative produtos do catálogo.</p>
      </div>

      <div className="flex gap-2">
        <Button variant="ghost" onClick={() => setScreen("admin")}>
          Voltar
        </Button>
        <Button onClick={startNewProduct}>
          <Plus size={16} />
          Novo Produto
        </Button>
      </div>
    </div>

    <div className="grid gap-3">
      {adminProducts.map((product) => (
        <Card key={product.id}>
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="font-bold text-[#132B55]">{product.name}</h3>
              <p className="text-sm text-slate-600">
                Código: {product.code} • Categoria: {product.category} • Unidade: {product.unit}
              </p>
              <p className="mt-1 font-bold">{currency(product.price)}</p>

              <span
                className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                  product.active
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {product.active ? "Ativo" : "Inativo"}
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button variant="ghost" onClick={() => startEditProduct(product)}>
                <Edit size={16} />
                Editar
              </Button>

              <Button
                variant={product.active ? "danger" : "ghost"}
                onClick={() => toggleProductStatus(product.id, product.active)}
              >
                <Trash2 size={16} />
                {product.active ? "Desativar" : "Reativar"}
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  </div>
);

const ProductForm = () => (
  <div className="mx-auto max-w-3xl space-y-5">
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold text-[#132B55]">
          {editingProductId ? "Editar Produto" : "Novo Produto"}
        </h2>
        <p className="text-slate-600">Preencha os dados do produto.</p>
      </div>

      <Button variant="ghost" onClick={() => setScreen("admin-products")}>
        Voltar
      </Button>
    </div>

    <Card>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-slate-700">Código</label>
          <input
            value={productForm.codigo}
            onChange={(e) => setProductForm({ ...productForm, codigo: e.target.value })}
            className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-[#2BA64A]"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">Nome do produto</label>
          <input
            value={productForm.nome}
            onChange={(e) => setProductForm({ ...productForm, nome: e.target.value })}
            className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-[#2BA64A]"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">Categoria</label>
          <select
            value={productForm.categoria_id}
            onChange={(e) => setProductForm({ ...productForm, categoria_id: e.target.value })}
            className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-[#2BA64A]"
          >
            <option value="">Selecione</option>
            {dbCategories.map((cat: any) => (
              <option key={cat.id} value={cat.id}>
                {cat.nome}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">Unidade</label>
          <input
            value={productForm.unidade}
            onChange={(e) => setProductForm({ ...productForm, unidade: e.target.value })}
            className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-[#2BA64A]"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">Preço</label>
          <input
            value={productForm.preco}
            onChange={(e) => setProductForm({ ...productForm, preco: e.target.value })}
            className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-[#2BA64A]"
            placeholder="Ex: 29.90"
          />
        </div>

        <div>
  <label className="text-sm font-medium text-slate-700">Imagem do produto</label>

  <input
    type="file"
    accept="image/*"
    onChange={(e) => {
      const file = e.target.files?.[0];
      if (file) uploadProductImage(file);
    }}
    className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-[#2BA64A]"
  />

  {uploadingImage && (
    <p className="mt-2 text-sm text-slate-500">Enviando imagem...</p>
  )}

  {productForm.imagem_url && (
    <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
      <img
        src={productForm.imagem_url}
        alt="Prévia do produto"
        className="h-40 w-full rounded-xl object-contain"
      />
      <p className="mt-2 break-all text-xs text-slate-500">
        {productForm.imagem_url}
      </p>
    </div>
  )}
</div>

        <div className="md:col-span-2">
          <label className="text-sm font-medium text-slate-700">Descrição</label>
          <textarea
            value={productForm.descricao}
            onChange={(e) => setProductForm({ ...productForm, descricao: e.target.value })}
            className="mt-1 min-h-24 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-[#2BA64A]"
          />
        </div>

        <div className="md:col-span-2">
          <label className="text-sm font-medium text-slate-700">Palavras-chave</label>
          <input
            value={productForm.palavras_chave}
            onChange={(e) => setProductForm({ ...productForm, palavras_chave: e.target.value })}
            className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-[#2BA64A]"
            placeholder="Ex: mangueira, pvc, construção"
          />
        </div>

        <div className="md:col-span-2">
          <label className="text-sm font-medium text-slate-700">Observações</label>
          <textarea
            value={productForm.observacoes}
            onChange={(e) => setProductForm({ ...productForm, observacoes: e.target.value })}
            className="mt-1 min-h-20 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-[#2BA64A]"
          />
        </div>
      </div>

      <Button className="mt-6 w-full" onClick={saveProduct}>
        Salvar Produto
      </Button>
    </Card>
  </div>
);
  const Admin = () => (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-[#132B55]">Painel Administrativo</h2>
        <p className="text-slate-600">Nesta primeira versão, o painel é um protótipo visual das funções administrativas.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
  <Package className="mb-4 text-[#2BA64A]" />
  <h3 className="font-bold text-[#132B55]">Produtos</h3>
  <p className="mt-1 text-sm text-slate-600">Cadastrar, editar e desativar produtos.</p>
  <Button className="mt-4 w-full" variant="ghost" onClick={() => setScreen("admin-products")}>
    <Edit size={16} />
    Gerenciar
  </Button>
</Card>
        <Card><Upload className="mb-4 text-[#2BA64A]" /><h3 className="font-bold text-[#132B55]">Importação</h3><p className="mt-1 text-sm text-slate-600">Enviar planilha CSV/XLSX de produtos.</p><Button className="mt-4 w-full" variant="ghost"><Upload size={16} />Importar</Button></Card>
        <Card><FileText className="mb-4 text-[#2BA64A]" /><h3 className="font-bold text-[#132B55]">Materiais</h3><p className="mt-1 text-sm text-slate-600">Organizar PDFs, campanhas e apresentações.</p><Button className="mt-4 w-full" variant="ghost">Gerenciar</Button></Card>
        <Card><Settings className="mb-4 text-[#2BA64A]" /><h3 className="font-bold text-[#132B55]">Configurações</h3><p className="mt-1 text-sm text-slate-600">Editar logo, cores e WhatsApp comercial.</p><Button className="mt-4 w-full" variant="ghost">Configurar</Button></Card>
      </div>
      <Card>
        <h3 className="font-bold text-[#132B55]">Modelo de planilha para importação</h3>
        <p className="mt-2 text-sm text-slate-600">Campos previstos: codigo, nome, descricao, categoria, unidade, preco, imagem_url, palavras_chave, observacoes, ativo.</p>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-100 pb-24 md:pb-6">
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-6">
        <motion.div key={screen} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.18 }}>
          {screen === "dashboard" && <Dashboard />}
          {screen === "catalog" && <Catalog />}
          {screen === "detail" && <Detail />}
          {screen === "quote" && <Quote />}
          {screen === "materials" && <Materials />}
          {screen === "admin" && <Admin />}
          {screen === "admin-products" && AdminProducts()}
          {screen === "product-form" && ProductForm()}
        </motion.div>
      </main>
      <BottomNav />
    </div>
  );
}
