(function_declaration) @chunk.function
(class_declaration) @chunk.class
(object_declaration) @chunk.class
(interface_declaration) @chunk.interface
(enum_class_body) @chunk.enum

(function_declaration name: (simple_identifier) @function_name)
(class_declaration name: (simple_identifier) @name)
(object_declaration name: (simple_identifier) @name)
(interface_declaration name: (simple_identifier) @interface_name)