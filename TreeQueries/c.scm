(function_definition) @chunk.function
(struct_specifier) @chunk.class
(enum_specifier) @chunk.enum

(function_definition declarator: (function_declarator declarator: (identifier) @function_name))
(struct_specifier name: (type_identifier) @name)
(enum_specifier name: (type_identifier) @enum_name)