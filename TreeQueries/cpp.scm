(function_definition) @chunk.function
(class_specifier) @chunk.class
(struct_specifier) @chunk.class
(enum_specifier) @chunk.enum

(function_definition declarator: (function_declarator declarator: (identifier) @function_name))
(class_specifier name: (type_identifier) @name)
(struct_specifier name: (type_identifier) @name)
(enum_specifier name: (type_identifier) @enum_name)