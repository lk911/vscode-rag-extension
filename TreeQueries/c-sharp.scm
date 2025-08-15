(method_declaration) @chunk.function
(class_declaration) @chunk.class
(interface_declaration) @chunk.interface
(enum_declaration) @chunk.enum

(method_declaration name: (identifier) @function_name)
(class_declaration name: (identifier) @name)
(interface_declaration name: (identifier) @interface_name)
(enum_declaration name: (identifier) @enum_name)