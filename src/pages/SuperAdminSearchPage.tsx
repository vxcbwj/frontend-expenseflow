import React, { useState } from "react";
import { superAdminAPI, type SearchResult } from "../services/superAdminAPI";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Users,
  Building2,
  DollarSign,
  X,
  Filter,
  ArrowRight,
  Calendar,
  Mail,
  Globe,
} from "lucide-react";

const SuperAdminSearchPage: React.FC = () => {
  const [query, setQuery] = useState("");
  const [entity, setEntity] = useState("");
  const [results, setResults] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<
    "all" | "users" | "companies" | "expenses"
  >("all");

  const performSearch = async () => {
    if (!query.trim() || query.length < 2) {
      setError("Search query must be at least 2 characters");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const response = await superAdminAPI.search(query, entity, 20);
      if (response.success) {
        setResults(response.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "Search failed");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      performSearch();
    }
  };

  const clearSearch = () => {
    setQuery("");
    setResults(null);
    setError("");
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // Tab navigation component
  const TabNav = () => (
    <div className="flex space-x-1 border-b border-gray-200 dark:border-gray-700">
      <button
        onClick={() => setActiveTab("all")}
        className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
          activeTab === "all"
            ? "bg-blue-50 text-blue-700 border-b-2 border-blue-500 dark:bg-blue-900/30 dark:text-blue-300"
            : "text-gray-500 hover:text-gray-700 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-800"
        }`}
      >
        <div className="flex items-center space-x-2">
          <Globe className="h-4 w-4" />
          <span>All</span>
          {results && (
            <Badge variant="secondary" className="ml-1">
              {(results.users?.length || 0) +
                (results.companies?.length || 0) +
                (results.expenses?.length || 0)}
            </Badge>
          )}
        </div>
      </button>
      <button
        onClick={() => setActiveTab("users")}
        className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
          activeTab === "users"
            ? "bg-blue-50 text-blue-700 border-b-2 border-blue-500 dark:bg-blue-900/30 dark:text-blue-300"
            : "text-gray-500 hover:text-gray-700 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-800"
        }`}
      >
        <div className="flex items-center space-x-2">
          <Users className="h-4 w-4" />
          <span>Users</span>
          {results?.users && (
            <Badge variant="secondary" className="ml-1">
              {results.users.length}
            </Badge>
          )}
        </div>
      </button>
      <button
        onClick={() => setActiveTab("companies")}
        className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
          activeTab === "companies"
            ? "bg-blue-50 text-blue-700 border-b-2 border-blue-500 dark:bg-blue-900/30 dark:text-blue-300"
            : "text-gray-500 hover:text-gray-700 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-800"
        }`}
      >
        <div className="flex items-center space-x-2">
          <Building2 className="h-4 w-4" />
          <span>Companies</span>
          {results?.companies && (
            <Badge variant="secondary" className="ml-1">
              {results.companies.length}
            </Badge>
          )}
        </div>
      </button>
      <button
        onClick={() => setActiveTab("expenses")}
        className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
          activeTab === "expenses"
            ? "bg-blue-50 text-blue-700 border-b-2 border-blue-500 dark:bg-blue-900/30 dark:text-blue-300"
            : "text-gray-500 hover:text-gray-700 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-800"
        }`}
      >
        <div className="flex items-center space-x-2">
          <DollarSign className="h-4 w-4" />
          <span>Expenses</span>
          {results?.expenses && (
            <Badge variant="secondary" className="ml-1">
              {results.expenses.length}
            </Badge>
          )}
        </div>
      </button>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center">
            <Search className="mr-3 h-8 w-8 text-blue-600 dark:text-blue-400" />
            Global Search
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Search across all users, companies, and expenses
          </p>
        </div>
      </div>

      {/* Search Box */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search for users, companies, expenses..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="pl-10 pr-10 h-12 text-lg"
                  disabled={loading}
                />
                {query && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
              <Button
                onClick={performSearch}
                disabled={loading || query.length < 2}
                className="h-12 px-6"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <Search className="h-5 w-5 mr-2" />
                    Search
                  </>
                )}
              </Button>
            </div>

            {/* Entity Filter */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Filter by:
                </span>
              </div>
              <div className="flex space-x-2">
                {["", "users", "companies", "expenses"].map((option) => (
                  <button
                    key={option}
                    onClick={() => setEntity(option === entity ? "" : option)}
                    className={`px-3 py-1 text-sm rounded-full transition-colors ${
                      entity === option
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
                    }`}
                  >
                    {option === ""
                      ? "All"
                      : option.charAt(0).toUpperCase() + option.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Card className="border-red-200 bg-red-50 dark:bg-red-900/20">
          <CardContent className="pt-6">
            <div className="text-red-700 dark:text-red-300 text-center">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-6 h-6" />
              </div>
              <p className="font-medium">{error}</p>
              {query.length < 2 && (
                <p className="text-sm mt-1">
                  Enter at least 2 characters to search
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {results && (
        <div className="space-y-6">
          {/* Results Summary */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                Search Results for "{query}"
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Found{" "}
                {(results.users?.length || 0) +
                  (results.companies?.length || 0) +
                  (results.expenses?.length || 0)}{" "}
                matches
              </p>
            </div>
            <Badge variant="secondary">
              {entity === ""
                ? "All Entities"
                : entity.charAt(0).toUpperCase() + entity.slice(1)}
            </Badge>
          </div>

          {/* Tab Navigation */}
          <TabNav />

          {/* All Results Tab */}
          {activeTab === "all" && (
            <div className="space-y-6">
              {/* Users Section */}
              {results.users && results.users.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Users className="h-5 w-5 mr-2" />
                      Users ({results.users.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                      {results.users.map((user, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                              {user.firstName?.[0]}
                              {user.lastName?.[0]}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900 dark:text-white">
                                {user.firstName} {user.lastName}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                                <Mail className="h-3 w-3 mr-1" />
                                {user.email}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge className="capitalize">
                              {user.role.replace("_", " ")}
                            </Badge>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              Joined {formatDate(user.createdAt)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Companies Section */}
              {results.companies && results.companies.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Building2 className="h-5 w-5 mr-2" />
                      Companies ({results.companies.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {results.companies.map((company, index) => (
                        <div
                          key={index}
                          className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-colors"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="font-semibold text-gray-900 dark:text-white">
                              {company.name}
                            </div>
                            <Badge
                              variant={
                                company.isActive ? "default" : "secondary"
                              }
                            >
                              {company.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            {company.industry}
                          </div>
                          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                            <div className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              Created {formatDate(company.createdAt)}
                            </div>
                            <ArrowRight className="h-4 w-4" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Expenses Section */}
              {results.expenses && results.expenses.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <DollarSign className="h-5 w-5 mr-2" />
                      Expenses ({results.expenses.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                      {results.expenses.map((expense, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-600 transition-colors"
                        >
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">
                              {expense.description}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {expense.companyId.name} • {expense.category}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-gray-900 dark:text-white">
                              {formatCurrency(expense.amount)}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {formatDate(expense.date)} • {expense.vendor}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Users Tab */}
          {activeTab === "users" && (
            <div>
              {results.users && results.users.length > 0 ? (
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      {results.users.map((user, index) => (
                        <div
                          key={index}
                          className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-4">
                              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                                {user.firstName?.[0]}
                                {user.lastName?.[0]}
                              </div>
                              <div>
                                <h3 className="font-semibold text-gray-900 dark:text-white">
                                  {user.firstName} {user.lastName}
                                </h3>
                                <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-400 mt-1">
                                  <span className="flex items-center">
                                    <Mail className="h-3 w-3 mr-1" />
                                    {user.email}
                                  </span>
                                  <span className="flex items-center">
                                    <Calendar className="h-3 w-3 mr-1" />
                                    Joined {formatDate(user.createdAt)}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <Badge className="capitalize mb-2">
                                {user.role.replace("_", " ")}
                              </Badge>
                              <div className="space-x-2">
                                <Button size="sm" variant="outline">
                                  View
                                </Button>
                                <Button size="sm" variant="outline">
                                  Edit
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center py-8">
                      <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 dark:text-gray-400">
                        No users found matching "{query}"
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Companies Tab */}
          {activeTab === "companies" && (
            <div>
              {results.companies && results.companies.length > 0 ? (
                <Card>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {results.companies.map((company, index) => (
                        <div
                          key={index}
                          className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                              <Building2 className="h-5 w-5 text-white" />
                            </div>
                            <Badge
                              variant={
                                company.isActive ? "default" : "secondary"
                              }
                            >
                              {company.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                            {company.name}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                            {company.industry}
                          </p>
                          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                            <span>Created {formatDate(company.createdAt)}</span>
                            <Button size="sm" variant="ghost">
                              View
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center py-8">
                      <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 dark:text-gray-400">
                        No companies found matching "{query}"
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Expenses Tab */}
          {activeTab === "expenses" && (
            <div>
              {results.expenses && results.expenses.length > 0 ? (
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-3">
                      {results.expenses.map((expense, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <Badge variant="outline" className="capitalize">
                                {expense.category}
                              </Badge>
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                {expense.companyId.name}
                              </span>
                            </div>
                            <h4 className="font-medium text-gray-900 dark:text-white">
                              {expense.description}
                            </h4>
                            <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mt-1">
                              <span>{formatDate(expense.date)}</span>
                              <span>•</span>
                              <span>{expense.vendor || "No vendor"}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-gray-900 dark:text-white">
                              {formatCurrency(expense.amount)}
                            </div>
                            <Button size="sm" variant="ghost" className="mt-2">
                              View Details
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center py-8">
                      <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 dark:text-gray-400">
                        No expenses found matching "{query}"
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      )}

      {/* Search Tips */}
      {!results && !loading && !error && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                Start Searching
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Enter a search term above to find users, companies, and expenses
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-left max-w-2xl mx-auto">
                <div className="space-y-2">
                  <div className="font-medium text-gray-700 dark:text-gray-300">
                    Search Examples
                  </div>
                  <div className="text-gray-500 dark:text-gray-400">
                    • "john@example.com"
                  </div>
                  <div className="text-gray-500 dark:text-gray-400">
                    • "Tech Solutions Inc"
                  </div>
                  <div className="text-gray-500 dark:text-gray-400">
                    • "Marketing expense"
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="font-medium text-gray-700 dark:text-gray-300">
                    Search Operators
                  </div>
                  <div className="text-gray-500 dark:text-gray-400">
                    • Minimum 2 characters
                  </div>
                  <div className="text-gray-500 dark:text-gray-400">
                    • Partial matches included
                  </div>
                  <div className="text-gray-500 dark:text-gray-400">
                    • Case-insensitive
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="font-medium text-gray-700 dark:text-gray-300">
                    Keyboard Shortcuts
                  </div>
                  <div className="text-gray-500 dark:text-gray-400">
                    • Enter: Search
                  </div>
                  <div className="text-gray-500 dark:text-gray-400">
                    • Esc: Clear
                  </div>
                  <div className="text-gray-500 dark:text-gray-400">
                    • Tab: Navigate
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SuperAdminSearchPage;
