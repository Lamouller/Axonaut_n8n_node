# 🚀 New Community Node: Axonaut API Integration

Hi n8n community! 👋

I'm excited to share a new community node I've developed for **Axonaut**, a comprehensive French CRM and business management platform. This node enables seamless integration between n8n workflows and Axonaut's API with revolutionary UPSERT capabilities!

## 📦 Installation

```bash
npm install n8n-nodes-axonaut-antislash
```

## ⚡ What is Axonaut?

Axonaut is a powerful all-in-one business management system popular in France that handles:

* Company and contact management
* Sales opportunities and pipeline tracking
* Project management and time tracking
* Invoice and quotation processing
* Product and supplier management
* Task and ticket management
* Document and contract handling

## 🎯 Node Features

This node provides comprehensive Axonaut integration with unique capabilities:

* **Complete API Coverage** with 14+ resources
* **Revolutionary UPSERT Operations** for 5 key endpoints
* **Ultra-Fast Performance** with direct API filtering
* **Dynamic Lists Everywhere** populated with real Axonaut data
* **Automatic Required Fields** handling
* **Operation Tracking** to know if records were created or updated

## 🔄 Game-Changing UPSERT Functionality

What sets this node apart is advanced **UPSERT** (create or update) capabilities for:

* **Companies**: Search by name or third-party code
* **Employees**: Ultra-fast email-based lookup with direct API filtering
* **Products**: Search by name or reference number  
* **Projects**: Search by name or project number
* **Opportunities**: Search by opportunity name

No more manual duplicate checking - just specify the unique identifier and let the node handle the rest!

## 🔧 Key Capabilities

✅ **Complete API Coverage**: Companies, Employees, Products, Projects, Opportunities, Invoices, Quotations, Tasks, Tickets, Suppliers, and more
✅ **Revolutionary UPSERT Operations**: Automatic create-or-update for 5 key endpoints
✅ **Ultra-Fast Performance**: Direct API filtering for employees, smart client-side filtering for others
✅ **Dynamic Lists Everywhere**: Real-time dropdown lists populated with your Axonaut data  
✅ **Automatic Required Fields**: Smart handling of mandatory API parameters
✅ **Operation Tracking**: Know if records were created or updated (_operation flag)

## 🛠️ Technical Details

* **API Compatibility**: Axonaut REST API v2
* **Authentication**: API key authentication with automatic header injection
* **Response Handling**: Comprehensive error handling and validation
* **Performance**: Client-side limiting and intelligent filtering
* **Coverage**: Maximum theoretical UPSERT coverage achieved (5/14 endpoints tested)
* **UPSERT Logic**: Smart search → update if found, create if not → operation tracking

## 📚 GitHub Repository

Full documentation and examples: [GitHub - Lamouller/Axonaut_n8n_node](https://github.com/Lamouller/Axonaut_n8n_node)

## 🙏 Looking for Feedback!

I'd love your feedback on:

* **UPSERT functionality and performance**
* **Node usability and interface design**  
* **Documentation clarity and examples**
* **Feature requests or improvements**
* **Bug reports or edge cases**
* **Best practices for advanced n8n node features**

## 🤝 Contributing

If you're using Axonaut or have suggestions for improvement, please:

* Open issues on GitHub
* Share your UPSERT use cases
* Suggest new endpoint integrations
* Help with documentation and examples

## 📖 Example Use Cases

* **CRM Synchronization**: Sync external leads with Axonaut companies using UPSERT to prevent duplicates
* **Sales Pipeline Automation**: Auto-create opportunities and track through project completion
* **Customer Data Integration**: Seamlessly merge customer data from multiple sources
* **Automated Invoicing**: Generate invoices from completed projects and send notifications
* **Employee Management**: Sync HR systems with Axonaut employee records using email-based UPSERT
* **Project Tracking**: Create projects from external requests and automatically assign resources

Thanks for checking it out! Looking forward to your thoughts and experiences with the node, especially the UPSERT functionality. 🚀

---

*P.S.: Special thanks to the n8n team for excellent documentation and the Axonaut team for providing a robust API that made this comprehensive integration possible!*
