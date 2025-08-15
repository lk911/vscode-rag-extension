(function_declaration) @chunk.function
(class_declaration) @chunk.class
(protocol_declaration) @chunk.interface
(enum_declaration) @chunk.enum

(function_declaration name: (identifier) @function_name)
(class_declaration name: (identifier) @name)
(protocol_declaration name: (identifier) @interface_name)
(enum_declaration name: (identifier) @enum_name)