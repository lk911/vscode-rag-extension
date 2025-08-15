(function_item) @chunk.function
(struct_item) @chunk.class
(enum_item) @chunk.enum
(trait_item) @chunk.interface

(function_item name: (identifier) @function_name)
(struct_item name: (type_identifier) @name)
(enum_item name: (type_identifier) @enum_name)
(trait_item name: (type_identifier) @interface_name)